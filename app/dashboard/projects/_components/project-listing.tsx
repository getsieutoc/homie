import { DataTable } from '@/components/ui/table/data-table';
import { searchParamsCache } from '@/lib/searchparams';
import { getProjects } from '@/services/projects';

import { columns } from './project-tables/columns';

export default async function ProjectListing() {
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

  const { projects, projectsNumber } = await getProjects(filters);

  return <DataTable columns={columns} data={projects} totalItems={projectsNumber} />;
}
