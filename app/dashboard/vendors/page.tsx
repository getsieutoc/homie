import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getVendors } from '@/services/vendors';
import { VendorListing } from './_components/vendor-listing';
import PageContainer from '@/components/layout/page-container';

export type Props = {
  searchParams: {
    page?: string;
    per_page?: string;
  };
};

export default async function VendorsPage({ searchParams }: Props) {
  const { data: vendors, metadata } = await getVendors({
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.per_page) || 10,
  });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading title="Vendors" description="Manage your security vendors" />
        </div>

        <Separator />

        <VendorListing vendors={vendors} totalItems={metadata.total} />
      </div>
    </PageContainer>
  );
}
