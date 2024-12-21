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
  id?: string;
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
  try {
    const { id, ...rest } = data;

    const { session, activeMembership } = await getAuth();

    if (!session || !activeMembership) {
      throw new Error('Unauthorized');
    }

    if (id) {
      return await prisma.project.update({
        where: { id },
        data: { ...rest },
      });
    }

    return await prisma.project.create({
      data: {
        ...rest,
        tenantId: activeMembership.tenantId,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
