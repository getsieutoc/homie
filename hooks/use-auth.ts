import { type User } from '@/types';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export type UseAuthOptions = Parameters<typeof useSession>[0];

export const useAuth = (options?: UseAuthOptions) => {
  const { data: session, status, ...rest } = useSession(options);

  const { data: user, isLoading } = useSWR<User>('/api/me');

  return {
    ...rest,
    status,
    session,
    user,
    isLoading: status === 'loading' || isLoading
  };
};
