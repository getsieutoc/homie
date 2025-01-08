'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/types';
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
    });

    return organization;
  } catch (error) {
    console.error('Error fetching organization:', error);
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
      data,
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

export async function switchOrganization(organizationId: string) {
  try {
    const { session, activeMembership } = await getAuth();

    if (!session || !activeMembership) {
      throw new Error('Unauthorized');
    }

    const { id: activeMembershipId } = activeMembership;

    const switchedOrganization = await prisma.membership.update({
      where: { id: activeMembershipId },
      data: { tenantId: organizationId },
    });

    revalidatePath('/dashboard');

    return switchedOrganization;
  } catch (error) {
    console.error('Error switching organization:', error);
  }
}
