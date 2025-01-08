'use client';

import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Slash, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Organization } from '@/types';

type Props = {
  organizations?: Organization[];
  currentOrganization?: Organization | null;
};

export function Breadcrumbs({ organizations, currentOrganization }: Props) {
  const items = useBreadcrumbs();

  const handleOrgChange = (orgId: string) => {
    // TODO: Implement organization change logic
    window.location.href = `/dashboard/settings/organization/${orgId}`;
  };

  if (items.length === 0 || organizations?.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index === 0 ? (
              <BreadcrumbItem className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-foreground/80">
                    {currentOrganization?.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {organizations?.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => handleOrgChange(org.id)}
                      >
                        {org.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            ) : index !== items.length - 1 ? (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block">
                <Slash />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
