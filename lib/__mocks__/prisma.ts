import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

import { ExtendedPrismaClient } from '../prisma';

beforeEach(() => {
  mockReset(prisma);
});

const prisma = mockDeep<ExtendedPrismaClient>();

export { prisma };
