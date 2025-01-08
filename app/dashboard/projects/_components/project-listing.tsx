'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Stats, type Project, type TriggerSchedule } from '@/types';
import { DataTable } from '@/components/ui/table/data-table';
import { Info } from 'lucide-react';
import { format } from 'date-fns';

import Link from 'next/link';

import { CellAction } from './project-table/cell-action';
import { ResultStats } from './result-stats';

type Props = {
  projects: Project[];
  schedules: TriggerSchedule[];
  stats: Record<string, Stats>;
};

export const ProjectListing = ({ projects, schedules, stats }: Props) => {
  return (
    <DataTable
      columns={[
        {
          accessorKey: 'domain',
          header: 'Domain',
          cell: ({ row }) => {
            const { id, domain, description } = row.original;
            return (
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/projects/${id}`}>{domain}</Link>
                {description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
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

            if (foundSchedule && foundSchedule.nextRun) {
              return <div>{format(foundSchedule.nextRun, 'dd.MM.yyyy HH:mm')}</div>;
            }
            return '-';
          },
        },
        {
          header: 'Status',
          cell: ({ row }) => {
            if (!stats) return '-';

            const { id: projectId } = row.original;
            const currentStats = stats[projectId];
            return <ResultStats projectId={projectId} stats={currentStats} />;
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
};
