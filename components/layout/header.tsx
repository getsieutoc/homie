import { getMyOrganizations, getOrganizationById } from '@/actions/organization';

import { SearchInput } from '../search-input';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';

import { ThemeToggle } from './theme-toggle';
import { getAuth } from '@/auth';

export const Header = async () => {
  const { activeMembership } = await getAuth();

  const organizations = await getMyOrganizations();

  const currentOrganization = await getOrganizationById(activeMembership?.tenantId);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumbs
          organizations={organizations}
          currentOrganization={currentOrganization}
        />
      </div>

      <div className="flex items-center gap-2 px-4">
        <div className="hidden md:flex">
          <SearchInput />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};
