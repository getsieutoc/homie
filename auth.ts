import CredentialProvider from 'next-auth/providers/credentials';
import { MIN_PASSWORD_LENGTH } from '@/lib/constants';
import { prisma } from '@/lib/prisma-client';
import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials) {
        console.log('-------- 1');

        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(MIN_PASSWORD_LENGTH)
          })
          .safeParse(credentials);
        console.log('-------- 2', { parsedCredentials, credentials });

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            omit: { hashedPassword: false },
            where: { email }
          });
          console.log('found user', user);

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) return null;

          return {
            id: user.id
          };
        }
        console.log('-------- 3');

        return null;
      }
    })
  ]
});
