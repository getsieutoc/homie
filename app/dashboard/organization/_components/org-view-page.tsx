import PageContainer from '@/components/layout/page-container';
import ProfileCreateForm from './org-create-form';

export default function OrganizationViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <ProfileCreateForm categories={[]} initialData={null} />
      </div>
    </PageContainer>
  );
}
