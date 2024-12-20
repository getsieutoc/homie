import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { searchParamsCache } from '@/lib/searchparams';
import { fakeProducts } from '@/constants/mock-api';
import { Product } from '@/constants/data';

import { columns } from './project-tables/columns';
import { getProjects } from '@/services/projects';

export default async function ProductListing() {
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

  const data = await fakeProducts.getProducts(filters);
  const totalProducts = data.total_products;
  const products: Product[] = data.products;

  const { projects } = await getProjects(filters);

  console.log('projects', projects);

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}
