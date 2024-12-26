'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { format } from 'date-fns';
import { Project } from '@/types';
import { HelpCircle } from 'lucide-react';

import { CellAction } from './project-table/cell-action';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type Props = {
  projects: Project[];
  schedules: any[];
};

export default async function ProjectListing({ projects, schedules }: Props) {
  console.log('### schedules: ', schedules);

  return (
    <DataTable
      columns={[
        {
          accessorKey: 'domain',
          header: 'Domain',
          cell: ({ row }) => {
            const { domain, description } = row.original;
            return (
              <div className="flex items-center gap-2">
                <span>{domain}</span>
                {description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            );
          },
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
          accessorKey: 'scheduleId',
          header: 'Next Schedule',
          cell: ({ row }) => {
            const value = row.getValue<string>('scheduleId');
            const foundSchedule = schedules.find((o) => o.id === value);
            if (foundSchedule) {
              return <div>{format(foundSchedule.nextRun, 'dd.MM.yyyy HH:mm')}</div>;
            }
            return '-';
          },
        },
        {
          id: 'actions',
          cell: ({ row }) => <CellAction data={row.original} />,
        },
      ]}
      data={projects}
      totalItems={projects.length}
    />
  );
}
