import { OrganizationListing } from './_components/org-listing';
import { OrganizationCreateForm } from './_components/org-create-form';

type pageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata = {
  title: 'Organizations | Homie',
};

export default function Page({ searchParams }: pageProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"></div>
      <OrganizationCreateForm />
      <OrganizationListing />
    </div>
  );
}
