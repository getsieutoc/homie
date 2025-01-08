'use client';

import { Vendor } from '@prisma/client';
import { DataTable } from '@/components/ui/table/data-table';
import { Badge } from '@/components/ui/badge';
import { CellAction } from './vendor-table/cell-action';
import { Button } from '@/components/ui/button';
import { ArrowUpNarrowWide, ArrowUpWideNarrow } from 'lucide-react';

export type Props = {
  vendors: Vendor[];
  totalItems: number;
};

export function VendorListing({ vendors, totalItems }: Props) {
  return (
    <DataTable
      columns={[
        {
          accessorKey: 'engineName',
          header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(isSorted === 'asc')}
              >
                Vendor Name
                {isSorted === 'asc' ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                ) : isSorted === 'desc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            );
          },
          size: 200,
        },
        {
          accessorKey: 'email',
          header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(isSorted === 'asc')}
              >
                Email
                {isSorted === 'asc' ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                ) : isSorted === 'desc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            );
          },
        },
        {
          accessorKey: 'url',
          header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(isSorted === 'asc')}
              >
                URL
                {isSorted === 'asc' ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                ) : isSorted === 'desc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            );
          },
          cell: ({ row }) => {
            const url = row.getValue('url') as string;
            if (!url) return null;
            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {url}
              </a>
            );
          },
        },
        {
          accessorKey: 'tenantId',
          header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(isSorted === 'asc')}
              >
                Type
                {isSorted === 'asc' ? (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                ) : isSorted === 'desc' ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpNarrowWide className="ml-2 h-4 w-4 opacity-50" />
                )}
              </Button>
            );
          },
          cell: ({ row }) => {
            const tenantId = row.original.tenantId as string | null;
            return (
              <Badge variant="outline" colorScheme="success">
                {tenantId ? 'Organization' : 'Default'}
              </Badge>
            );
          },
        },
        {
          id: 'actions',
          cell: ({ row }) => <CellAction data={row.original} />,
        },
      ]}
      data={vendors}
      totalItems={totalItems}
    />
  );
}
