import { SearchParams } from 'nuqs/parsers';
import OrganizationViewPage from './_components/org-view-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Organization | Homie',
};

export default async function Page({ searchParams }: pageProps) {
  return <OrganizationViewPage />;
}
