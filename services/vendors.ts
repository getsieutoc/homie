'use server';

import { getAuth } from '@/auth';
import { prisma } from '@/lib/prisma';

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
  name: string;
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
          OR: [{ tenantId }, { tenantId: null }],
        },
        search
          ? {
              OR: [
                {
                  name: {
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

export const getVendorById = async (id: string) => {
  return prisma.vendor.findUnique({
    where: { id },
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
