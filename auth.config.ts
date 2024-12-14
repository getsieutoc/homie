import { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';

const authConfig = {
  secret: process.env.AUTH_SECRET!,

  adapter: PrismaAdapter(prisma),

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
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: 'John',
          email: credentials?.email as string
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],

  pages: {
    signIn: '/login',
    verifyRequest: '/login',
    error: '/login' // Error code passed in query string as ?error=
  }
} satisfies NextAuthConfig;

export default authConfig;
