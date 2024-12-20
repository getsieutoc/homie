import { Prisma } from '@prisma/client';

export const userIncludes = {
  memberships: {
    select: {
      id: true,
      tenantId: true,
      status: true,
    },
  },
};

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;
