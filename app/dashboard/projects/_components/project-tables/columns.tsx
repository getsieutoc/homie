'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Project } from '@/types';

import { CellAction } from './cell-action';

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'domain',
    header: 'Domain',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last updated',
    cell: ({ row }) => {
      const value = row.getValue<Project['updatedAt']>('updatedAt');
      if (!value) return '-';
      const date = value instanceof Date ? value : new Date(value);
      return <div>{format(date, 'dd.MM.yyyy HH:mm')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
