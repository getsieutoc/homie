import { fetcher } from '@/lib/utils';

export const configs = {
  fetcher,
  suspend: true,
  keepPreviousData: true,
  revalidateOnMount: true
};
