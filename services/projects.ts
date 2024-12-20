'use server';

import { getAuth } from '@/auth';
import { prisma } from '@/lib/prisma-client';
import { Prisma } from '@prisma/client';

export type ProjectFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CreateProjectData = {
  name: string;
  domain: string;
};

export type UpsertProjectData = {
  domain: string;
  description?: string;
  id?: string | null;
};

export const getProjects = async (filters?: ProjectFilters) => {
  const { page = 1, limit = 10, search } = filters || {};

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build where clause
  const where = {
    AND: [
      // Add search filter
      search
        ? {
            OR: [
              {
                name: { contains: search, mode: Prisma.QueryMode.insensitive },
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
  };

  // Get total count for pagination
  const projectsNumber = await prisma.project.count({ where });

  // Get paginated and filtered results
  const projects = await prisma.project.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    projects,
    totalProjects: projectsNumber,
  };
};

export const upsertProject = async (data: UpsertProjectData) => {
  const { id, ...rest } = data;
  console.log({ id, rest });

  const { session, activeMembership, user } = await getAuth();

  console.log({ session, activeMembership, user });

  if (!session) {
    throw new Error('Unauthorized');
  }

  if (id && activeMembership) {
    const project = await prisma.project.upsert({
      where: { id },
      update: { ...rest },
      create: { ...rest, tenantId: activeMembership.tenantId },
    });
    return project;
  }

  return null;
};
