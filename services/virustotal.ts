'use server';

import { fetcher } from '@/lib/utils';

export const checkDomain = async (domain: string) => {
  const response = await fetcher(`https://www.virustotal.com/api/v3/domains/${domain}`, {
    headers: {
      'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
    },
  });

  if (!response) {
    throw new Error('VirusTotal API error');
  }

  console.log({ response });

  return response;
};
