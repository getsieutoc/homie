import { MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { prisma } from '@/lib/prisma-client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const saltRounds = 12;

export const signup = async (credentials: {
  email: string;
  password: string;
}) => {
  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(MIN_PASSWORD_LENGTH)
    })
    .safeParse(credentials);

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword
      }
    });

    return {
      data: { id: newUser.id }
    };
  }

  return {
    message: 'Credentials are invalid'
  };
};
