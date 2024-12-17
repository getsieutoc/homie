import { GeneralProviders } from '@/components/general-providers';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';
import { Lato } from 'next/font/google';
import type { Metadata } from 'next';
import { getAuth } from '@/auth';

import './globals.css';
import { Sign } from 'crypto';
import { SignOutTrigger } from '@/components/signout-trigger';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await getAuth();

  if (session && !user) {
    return <SignOutTrigger />;
  }

  return (
    <html
      lang="en"
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <GeneralProviders session={session}>
          <Toaster />
          {children}
        </GeneralProviders>
      </body>
    </html>
  );
}
