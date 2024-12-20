import { MembershipStatus } from '@prisma/client';
import { type UserWithPayload } from '@/types';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export type UseAuthOptions = Parameters<typeof useSession>[0];

export const useAuth = (options?: UseAuthOptions) => {
  const { data: session, status, ...rest } = useSession(options);

  const { data: user, isLoading } = useSWR<
    Omit<UserWithPayload, 'hashedPassword'>
  >(session ? '/api/me' : null);

  const activeMembership = user?.memberships.find(
    (membership) => membership.status === MembershipStatus.ACTIVE
  );

  return {
    ...rest,
    status,
    session,
    user,
    activeMembership,
    isLoading: status === 'loading' || isLoading,
  };
};
