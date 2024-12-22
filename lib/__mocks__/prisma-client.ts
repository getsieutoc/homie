import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import { ExtendedPrismaClient } from '../prisma-client';

beforeEach(() => {
  mockReset(prisma);
});

const prisma = mockDeep<ExtendedPrismaClient>();

export { prisma };
