'use server';

import { getAuth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export type UpsertProjectData = {
  domain: string;
  description?: string;
  id?: string;
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

  return {
    projects,
    projectsNumber: projects.length,
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

  revalidatePath('/dashboard/projects');

  return deletedProject;
};

export const upsertProject = async (data: UpsertProjectData) => {
  const { id, ...rest } = data;

  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  if (id) {
    const updateProject = await prisma.project.update({
      where: { id },
      data: { ...rest },
    });

    revalidatePath(`/dashboard/projects/${id}`, 'layout');

    return updateProject;
  }

  // Clear NextJS cache for projects
  revalidatePath('/dashboard/projects');

  return await prisma.project.create({
    data: {
      ...rest,
      tenantId: activeMembership.tenantId,
    },
  });
};
