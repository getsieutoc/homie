import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userIncludes } from '@/lib/rich-includes';
import { SystemRole, MembershipStatus, Prisma } from '@prisma/client';
import type { Session } from 'next-auth';
import { GET } from './route';

// Create typed mock implementations
const mockSession: Session = {
  user: { id: 'test-user-id' },
  expires: '2024-12-31T23:59:59.999Z',
};

const mockAuth = vi.fn((isLoggedIn: boolean = false) =>
  Promise.resolve<Session | null>(isLoggedIn ? mockSession : null)
);

// Create a typed mock for findUnique with Prisma types
const mockFindUnique = vi
  .fn()
  .mockImplementation((args: Prisma.UserFindUniqueArgs) =>
    Promise.resolve<Prisma.UserGetPayload<{ include: typeof userIncludes }> | null>(null)
  );

// Mock the entire prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: (...args: any[]) => mockFindUnique(...args),
    },
  },
}));

vi.mock('@/auth', () => ({
  auth: () => mockAuth(),
}));

describe('GET /api/me', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAuth.mockReset();
    mockFindUnique.mockReset();
  });

  it('should return null with status 201 when no session or user is found', async () => {
    mockAuth.mockResolvedValueOnce(null);

    const response = await GET();

    expect(response.status).toBe(201);
    expect(await response.json()).toBeNull();
  });

  it('should return session with status 200 when a session is found', async () => {
    const mockUserData = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: null,
      image: null,
      createdAt: new Date('2024-12-22').toISOString(),
      updatedAt: new Date('2024-12-22').toISOString(),
      deletedAt: null,
      role: 'USER',
      memberships: [],
      accounts: [],
    };

    mockAuth.mockResolvedValueOnce(mockSession);
    mockFindUnique.mockResolvedValueOnce(mockUserData);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockUserData);
  });

  it('should return user data with status 200 when a valid session and user exist', async () => {
    const mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: null,
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      hashedPassword: 'hashed',
      role: SystemRole.CUSTOMER,
      memberships: [
        {
          id: '456',
          tenantId: '789',
          status: MembershipStatus.ACTIVE,
        },
      ],
    };

    const mockSessionWithUser = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: { id: mockUser.id as string },
    } satisfies Session;

    mockAuth.mockResolvedValueOnce(mockSessionWithUser);
    mockFindUnique.mockResolvedValueOnce(mockUser);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(mockUser);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      include: userIncludes,
    });
  });

  it('should return an error message with status 500 when an exception occurs', async () => {
    mockAuth.mockRejectedValueOnce(new Error('Auth error'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      message: 'Can not get my profile data',
    });
  });

  it('should not return user data if session is null', async () => {
    // Mock session as null to simulate unauthenticated state
    mockAuth.mockResolvedValueOnce(null);

    // Mock user data that should not be returned
    mockFindUnique.mockResolvedValueOnce({
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
    });

    const response = await GET();

    // Verify response status and content
    expect(response.status).toBe(201);
    expect(await response.json()).toBeNull();

    // Verify that findUnique was never called since session was null
    expect(mockFindUnique).not.toHaveBeenCalled();
  });
});
