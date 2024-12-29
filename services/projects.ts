'use server';

import { schedules as triggerSchedules } from '@trigger.dev/sdk/v3';
import { type OptionalExcept, type Project, Prisma } from '@/types';
import { revalidatePath } from 'next/cache';
import { Keys } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

export const getProjectById = async (id: string) => {
  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  const { tenantId } = activeMembership;

  const project = await prisma.project.findUniqueOrThrow({
    where: { id, tenantId },
  });

  const schedule = await triggerSchedules.retrieve(project.scheduleId!);

  return { project, schedule };
};

export type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getProjects = async (filters?: ProjectFilters) => {
  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  const { tenantId } = activeMembership;

  const totalProjects = await prisma.project.count({
    where: {
      deletedAt: null,
      tenantId,
    },
  });

  const { page = 1, limit = 10, search } = filters || {};

  // Get paginated and filtered results
  const projects = await prisma.project.findMany({
    where: {
      AND: [
        {
          deletedAt: null,
          tenantId,
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
    scheduleIds.map((scheduleId) => triggerSchedules.retrieve(scheduleId))
  );

  return {
    projects,
    totalProjects,
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
      where: { id, tenantId },
      data: { ...rest, domain },
    });

    const updatedSchedule = await triggerSchedules.update(updatedProject.scheduleId!, {
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

  const createdSchedule = await triggerSchedules.create({
    deduplicationKey: `${tenantId}/${domain}`,
    task: Keys.CHECK_VIRUSTOTAL_TASK,
    externalId: createdProject.id,
    cron,
  });

  await prisma.project.update({
    where: { id: createdProject.id, tenantId },
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
  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  const { tenantId } = activeMembership;

  const foundProject = await prisma.project.findUniqueOrThrow({
    where: { id, tenantId },
  });

  const deletedProject = await prisma.project.update({
    where: { id },
    data: {
      domain: `${foundProject.domain}-deleted-${Date.now()}`,
      deletedAt: new Date(),
    },
  });

  if (foundProject.scheduleId) {
    await triggerSchedules.del(foundProject.scheduleId);
  }

  revalidatePath('/dashboard/projects');

  return deletedProject;
};
