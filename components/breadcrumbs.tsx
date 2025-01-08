'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slash, ChevronDown, Plus } from 'lucide-react';
import { switchOrganization } from '@/services/organization';
import { Button } from '@/components/ui/button';
import { type Organization } from '@/types';
import { useBreadcrumbs } from '@/hooks';
import { Fragment, useState } from 'react';

import { OrganizationCreateForm } from './org-create-form';
import { Icons } from './icons';

type Props = {
  organizations?: Organization[];
  currentOrganization?: Organization | null;
};

export function Breadcrumbs({ organizations, currentOrganization }: Props) {
  const items = useBreadcrumbs();

  const handleOrgChange = async (orgId: string) => {
    await switchOrganization(orgId);
  };

  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  const handleAddNewOrganization = () => {
    setIsCreateOrgModalOpen(true);
  };

  const handleOrgCreated = async (newOrg: Organization) => {
    await switchOrganization(newOrg.id);
    setIsCreateOrgModalOpen(false);
  };

  if (items.length === 0 || organizations?.length === 0) return null;

  return (
    <>
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
                          {currentOrganization?.id === org.id ? (
                            <Icons.circleCheck className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Icons.circle className="mr-2 h-4 w-4 text-gray-500" />
                          )}
                          {org.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleAddNewOrganization}>
                        <Plus className="mr-1 h-4 w-4" />
                        Add new organization
                      </DropdownMenuItem>
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

      <OrganizationCreateForm
        isOpen={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
        onSuccess={handleOrgCreated}
      />
    </>
  );
}
