'use server';

import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

export const isDefaultVendorsEmpty = async () => {
  const count = await prisma.vendor.count({
    where: {
      tenantId: null,
    },
  });
  return count === 0;
};

export type VendorFilters = {
  page?: number;
  limit?: number;
  search?: string;
};

export type UpsertVendorData = {
  id?: string;
  engineName: string;
  email?: string;
  url?: string;
  tenantId: string;
};

export const getVendors = async (filters?: VendorFilters) => {
  const { page = 1, limit = 10, search } = filters || {};

  const { session, activeMembership } = await getAuth();

  if (!session || !activeMembership) {
    throw new Error('Unauthorized');
  }

  const { tenantId } = activeMembership;

  const vendors = await prisma.vendor.findMany({
    where: {
      AND: [
        {
          deletedAt: null,
          OR: [
            {
              tenantId: null,
            },
            {
              tenantId,
            },
          ],
        },
        search
          ? {
              OR: [
                {
                  engineName: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  url: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.vendor.count({
    where: {
      deletedAt: null,
      OR: [{ tenantId }, { tenantId: null }],
    },
  });

  return {
    data: vendors,
    metadata: {
      total,
      page,
      limit,
    },
  };
};

export const getOneVendor = async (key: string) => {
  const foundById = await prisma.vendor.findUnique({
    where: { id: key },
  });

  if (foundById) {
    return foundById;
  }

  // If not found by ID, try to find by engineName
  return await prisma.vendor.findUnique({
    where: { engineName: key },
  });
};

export const upsertVendor = async (data: UpsertVendorData) => {
  const { id, ...rest } = data;

  if (id) {
    return prisma.vendor.update({
      where: { id },
      data: rest,
    });
  }

  return prisma.vendor.create({
    data: rest,
  });
};

export const deleteVendor = async (id: string) => {
  return prisma.vendor.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
};
