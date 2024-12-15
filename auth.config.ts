import { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma-client';

const authConfig = {
  secret: process.env.AUTH_SECRET!,

  adapter: PrismaAdapter(prisma),

  providers: [],

  pages: {
    signIn: '/login',
    verifyRequest: '/login',
    error: '/login' // Error code passed in query string as ?error=
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
