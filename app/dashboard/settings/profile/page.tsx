import { SearchParams } from 'nuqs/parsers';
import PageContainer from '@/components/layout/page-container';
import ProfileCreateForm from './_components/profile-create-form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

// type pageProps = {
//   searchParams: SearchParams;
// };

export const metadata = {
  title: 'Dashboard : Profile',
};

export default async function ProfilePage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Profile" description="Manage your profile" />
        </div>

        <Separator />

        <div className="space-y-4"></div>
      </div>
    </PageContainer>
  );
}
