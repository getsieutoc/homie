import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import { ProjectForm } from './project-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProjectView({
  productId,
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    const data = await fakeProducts.getProductById(Number(productId));
    product = data.product as Product;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
  }

  return <ProjectForm initialData={product} />;
}
