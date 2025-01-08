import PageContainer from '@/components/layout/page-container';
import { tenantIncludes } from '@/lib/rich-includes';
import { Heading } from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

import { UpdateOrganizationForm } from './_components/update-organization-form';

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata = {
  title: 'Organization Settings | Homie',
};

export default async function Page({ searchParams }: PageProps) {
  const { user, activeMembership } = await getAuth();

  if (!user) {
    redirect('/auth');
  }

  const tenant = await prisma.tenant.findUnique({
    where: {
      id: activeMembership?.tenantId,
    },
    include: tenantIncludes,
  });

  if (!tenant) {
    return <div>No organization found</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Organization Settings"
            description="Manage organization settings"
          />
        </div>

        <div className="space-y-4">
          <UpdateOrganizationForm data={tenant} />

          <div className="space-y-2">
            <Label>Projects</Label>
            <div className="text-sm text-muted-foreground">
              {tenant.projects.length} projects
            </div>
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            <div className="space-y-2">
              {tenant.memberships.map((membership) => (
                <div key={membership.id} className="flex items-center gap-2">
                  <div className="text-sm">
                    {membership.user.name || membership.user.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({membership.role.toLowerCase()})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
