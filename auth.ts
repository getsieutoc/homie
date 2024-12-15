import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
// import { verify } from '@node-rs/argon2';
import { prisma } from '@/lib/prisma-client';
import { z } from 'zod';
import authConfig from './auth.config';

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
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: { email },
            omit: { hashedPassword: false }
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.hashedPassword);

          if (!isValid) return null;

          return {
            id: user.id
          };
        }

        return null;
      }
    })
  ]
});
