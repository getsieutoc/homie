'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { type ResultStats } from '@/services/results';
import { HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { type Project } from '@/types';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { CellAction } from './project-table/cell-action';

type Props = {
  projects: Project[];
  schedules: any[];
  stats?: Record<string, ResultStats>;
};

export default async function ProjectListing({ projects, schedules, stats }: Props) {
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
          header: 'Status',
          cell: ({ row }) => {
            if (!stats) return '-';

            const { id } = row.original;
            const currentStats = stats[id];
            return (
              <div className="flex gap-x-2">
                {currentStats.map((stat) => (
                  <div key={stat.result}>
                    {stat.result}: {stat._count.result}
                  </div>
                ))}
              </div>
            );
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
