import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';
import { tenantIncludes } from '@/lib/rich-includes';

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const metadata = {
  title: 'Organization Settings | Homie',
};

export default async function Page({ searchParams }: PageProps) {
  const { user, activeMembership } = await getAuth();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Get current tenant through user's membership
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" name="name" defaultValue={tenant.name} />
          </div>

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

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
