'use client';

import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Provider as JotaiProvider } from 'jotai';
import { configs } from '@/lib/swr-configs';
import { SWRConfig } from 'swr';
import { type ReactNode } from 'react';

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
        <SessionProvider session={session}>
          <JotaiProvider>{children}</JotaiProvider>
        </SessionProvider>
      </NextThemesProvider>
    </SWRConfig>
  );
};
