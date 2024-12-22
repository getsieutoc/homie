'use server';

import { MembershipRole, MembershipStatus } from '@prisma/client';
import { MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const saltRounds = 12;

export const signup = async (credentials: { email: string; password: string }) => {
  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(MIN_PASSWORD_LENGTH),
    })
    .safeParse(credentials);

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    if (newUser) {
      // Create a default tenant for the user
      await prisma.tenant.create({
        data: {
          name: 'Default Organization',
          memberships: {
            create: {
              userId: newUser.id,
              role: MembershipRole.OWNER,
              status: MembershipStatus.ACTIVE,
            },
          },
        },
      });
    }

    return {
      data: { id: newUser.id },
    };
  }

  return {
    message: 'Credentials are invalid',
  };
};
