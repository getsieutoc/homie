import { useSession } from 'next-auth/react';
import { type User } from '@/types';
import useSWR from 'swr';

export type UseAuthOptions = Parameters<typeof useSession>[0];

export const useAuth = (options?: UseAuthOptions) => {
  const { data: session, status, ...rest } = useSession(options);

  const { data: user, isLoading } = useSWR<Omit<User, 'hashedPassword'>>(
    session ? '/api/me' : null
  );

  return {
    ...rest,
    status,
    session,
    user,
    isLoading: status === 'loading' || isLoading
  };
};
