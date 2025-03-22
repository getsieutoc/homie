'use server';

import { type VTDomainResponse } from '@/types';
import { fetcher } from '@/lib/utils';

export const checkDomain = async (domain: string) => {
  const response = await fetcher<VTDomainResponse>(
    `https://www.virustotal.com/api/v3/domains/${domain}`,
    {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
      },
    }
  );

  if ('error' in response) {
    throw new Error(response.error.message ?? 'Something wrong in checking domain');
  }

  return response;
};
