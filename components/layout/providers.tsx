'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { configs } from '@/lib/swr-configs';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

export const GeneralProviders = ({
  session,
  children
}: {
  session: SessionProviderProps['session'];
  children: ReactNode;
}) => {
  return (
    <SWRConfig value={configs}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>{children}</SessionProvider>
      </NextThemesProvider>
    </SWRConfig>
  );
};
