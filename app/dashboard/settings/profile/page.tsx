import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

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
