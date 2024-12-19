import { useSearchParams } from 'next/navigation';

export const useQueryString = (query: string) => {
  const searchParams = useSearchParams();

  return {
    params: searchParams,
    hasQuery: searchParams.has(query),
    query: searchParams.get(query)
  };
};
