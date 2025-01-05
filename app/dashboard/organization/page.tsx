import OrganizationViewPage from './_components/org-view-page';
import OrganizationCreateForm from './_components/org-create-form';

type pageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

// export const metadata = {
//   title: 'Organization | Homie',
// };

export default function Page({ searchParams }: pageProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end"></div>
      <OrganizationViewPage />
      <OrganizationCreateForm />
    </div>
  );
}
