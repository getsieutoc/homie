'use server';

import { revalidatePath } from 'next/cache';
import { type VTResult } from '@/types';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

export type GetResultStats = {
  projectId: string;
};

export type ResultStats = ReturnType<typeof getResultStats>;

export const getResultStats = async ({ projectId }: GetResultStats) => {
  return await prisma.result.groupBy({
    by: ['result'],
    where: { projectId },
    _count: {
      result: true,
    },
  });
};

export type UpsertResultsData = {
  results: VTResult[];
  projectId: string;
};

export const upsertResults = async (data: UpsertResultsData) => {
  const { results, projectId } = data;

  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  for (const result of results) {
    await prisma.result.upsert({
      where: {
        projectId_engineName: {
          engineName: result.engine_name,
          projectId,
        },
      },
      update: {
        category: result.category,
        method: result.method,
        result: result.result,
      },
      create: {
        engineName: result.engine_name,
        category: result.category,
        method: result.method,
        result: result.result,
        projectId,
      },
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`, 'layout');

  revalidatePath('/dashboard/projects');

  return await prisma.result.findMany({
    where: {
      projectId,
    },
  });
};
