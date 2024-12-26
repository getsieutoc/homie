import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { getProjects } from '@/services/projects';
import PageContainer from '@/components/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { SearchParams } from 'nuqs/parsers';
import { Suspense } from 'react';

import ProjectTableAction from './_components/project-table/project-table-action';
import ProjectListing from './_components/project-listing';
import { AddProjectModal } from './_components/add-project-modal';

export const metadata = {
  title: 'Projects | Homie',
};

type pageProps = {
  searchParams: SearchParams;
};

export default async function ProjectsPage({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories }),
  };

  const { projects, schedules } = await getProjects(filters);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Projects" description="Manage projects" />
          <AddProjectModal />
        </div>
        <Separator />

        <ProjectTableAction />

        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ProjectListing projects={projects} schedules={schedules} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
