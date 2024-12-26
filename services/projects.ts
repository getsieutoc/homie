'use server';

import { Prisma, type Project } from '@prisma/client';
import { schedules } from '@trigger.dev/sdk/v3';
import { type OptionalExcept } from '@/types';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';
import { Keys } from '@/lib/constants';

export type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getProjects = async (filters?: ProjectFilters) => {
  const { page = 1, limit = 10, search } = filters || {};

  // Get paginated and filtered results
  const projects = await prisma.project.findMany({
    where: {
      AND: [
        {
          deletedAt: null,
        },
        // Add search filter
        search
          ? {
              OR: [
                {
                  domain: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
      ],
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const scheduleIds = projects.map((o) => o.scheduleId).filter((id) => !!id) as string[];

  const scheduleResponses = await Promise.all(
    scheduleIds.map((scheduleId) => schedules.retrieve(scheduleId))
  );

  return {
    projects,
    projectsNumber: projects.length,
    schedules: scheduleResponses,
  };
};

export type UpsertProjectData = OptionalExcept<Project, 'domain'> & {
  cron: string;
};

export const upsertProject = async (data: UpsertProjectData) => {
  const { id, domain, cron, ...rest } = data;

  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  const { tenantId } = activeMembership;

  if (id) {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { ...rest, domain },
    });

    const updatedSchedule = await schedules.update(updatedProject.scheduleId!, {
      task: Keys.CHECK_VIRUSTOTAL_TASK,
      cron,
    });

    revalidatePath(`/dashboard/projects/${id}`, 'layout');

    return { project: updatedProject, schedule: updatedSchedule };
  }

  const createdProject = await prisma.project.create({
    data: {
      ...rest,
      tenantId,
      domain,
    },
  });

  const createdSchedule = await schedules.create({
    deduplicationKey: `${tenantId}/${domain}`,
    task: Keys.CHECK_VIRUSTOTAL_TASK,
    externalId: createdProject.id,
    cron,
  });

  await prisma.project.update({
    where: { id: createdProject.id },
    data: {
      scheduleId: createdSchedule.id,
    },
  });

  // Clear NextJS cache for projects
  revalidatePath('/dashboard/projects');

  return {
    project: createdProject,
    schedule: createdSchedule,
  };
};

export const deleteProject = async (id: string) => {
  const { session } = await getAuth();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const foundProject = await prisma.project.findUniqueOrThrow({
    where: { id },
  });

  const deletedProject = await prisma.project.update({
    where: { id },
    data: {
      domain: `${foundProject.domain}-deleted-${Date.now()}`,
      deletedAt: new Date(),
    },
  });

  if (foundProject.scheduleId) {
    await schedules.del(foundProject.scheduleId);
  }

  revalidatePath('/dashboard/projects');

  return deletedProject;
};
