'use server';

import { MembershipRole, MembershipStatus, Prisma } from '@prisma/client';
import { tenantIncludes } from '@/lib/rich-includes';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

export async function getMyOrganizations() {
  try {
    const { session } = await getAuth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    const organizations = await prisma.tenant.findMany({
      where: {
        memberships: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    return organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
  }
}

export async function getOrganizationById(id?: string) {
  try {
    const { session } = await getAuth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    if (!id) {
      return null;
    }

    const organization = await prisma.tenant.findUnique({
      where: { id },
      include: tenantIncludes,
    });

    return organization;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
}

export async function updateOrganization(id: string, data: Prisma.TenantUpdateInput) {
  try {
    const { session } = await getAuth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    const updatedOrganization = await prisma.tenant.update({
      where: { id },
      data,
    });

    revalidatePath('/settings/organization');

    return updatedOrganization;
  } catch (error) {
    console.error('Error updating organization:', error);
  }
}

// create organization
export async function createOrganization(data: Prisma.TenantCreateInput) {
  try {
    const { session } = await getAuth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    const newOrganization = await prisma.tenant.create({
      data: {
        ...data,
        memberships: {
          create: {
            userId: session.user.id,
            role: MembershipRole.OWNER,
            status: MembershipStatus.JOINED,
          },
        },
      },
    });

    revalidatePath('/settings/organization');
    revalidatePath('/dashboard');

    return newOrganization;
  } catch (error) {
    console.error('Error creating organization:', error);
  }
}

export async function deleteOrganization(id: string) {
  try {
    const { session } = await getAuth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    const deletedOrganization = await prisma.tenant.delete({
      where: { id },
    });

    revalidatePath('/settings/organization');
    revalidatePath('/dashboard');

    return deletedOrganization;
  } catch (error) {
    console.error('Error deleting organization:', error);
  }
}

export async function switchOrganization(tenantId: string) {
  try {
    const { session, activeMembership } = await getAuth();

    if (!session || !activeMembership) {
      throw new Error('Unauthorized');
    }

    // Change current membership into 'JOINED' status
    await prisma.membership.update({
      where: {
        tenantId_userId: {
          userId: session.user.id,
          tenantId: activeMembership.tenantId,
        },
      },
      data: {
        status: MembershipStatus.JOINED,
      },
    });

    // Change the target membership into 'ACTIVE' status
    const membershipToActivate = await prisma.membership.upsert({
      where: {
        tenantId_userId: {
          userId: session.user.id,
          tenantId: tenantId,
        },
      },
      create: {
        userId: session.user.id,
        tenantId: tenantId,
        role: MembershipRole.OWNER,
        status: MembershipStatus.ACTIVE,
      },
      update: {
        status: MembershipStatus.ACTIVE,
      },
    });

    revalidatePath('/dashboard', 'layout');

    return membershipToActivate;
  } catch (error) {
    console.error('Error switching organization:', error);
    throw error;
  }
}
