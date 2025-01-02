import PageContainer from '@/components/layout/page-container';
import OrganizationCreateForm from './org-create-form';

export default function OrganizationViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <OrganizationCreateForm />
      </div>
    </PageContainer>
  );
}
