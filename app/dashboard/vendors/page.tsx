import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getVendors } from '@/services/vendors';
import { VendorListing } from './_components/vendor-listing';

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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Vendors" description="Manage your security vendors" />
      </div>
      <Separator />
      <VendorListing vendors={vendors} totalItems={metadata.total} />
    </div>
  );
}
