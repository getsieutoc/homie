import { PrismaClient } from '@prisma/client';

declare global {
  // We need var in declare global
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: ExtendedPrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    omit: {
      user: {
        hashedPassword: true
      },
      apiKey: {
        hashedSecretKey: true
      }
    }
  });
};

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
