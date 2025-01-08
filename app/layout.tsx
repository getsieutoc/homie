import './globals.css';

import { GeneralProviders } from '@/components/general-providers';
import { SignOutTrigger } from '@/components/signout-trigger';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';
import { Lato } from 'next/font/google';
import { type Metadata } from 'next';
import { getAuth } from '@/auth';

export const metadata: Metadata = {
  title: 'Homie',
  description: 'We got you covered',
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { session, user } = await getAuth();

  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning={true}>
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <GeneralProviders session={session}>
          {session && !user ? <SignOutTrigger /> : children}
          <Toaster />
        </GeneralProviders>
      </body>
    </html>
  );
}
