'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { type Stats, type Project } from '@/types';
import { HelpCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { CellAction } from './project-table/cell-action';
import { ResultStats } from './result-stats';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  projects: Project[];
  schedules: any[];
  stats: Record<string, Stats>;
};

export const ProjectListing = ({ projects, schedules, stats }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Dialog open={isLoading}>
        <DialogContent className="flex items-center justify-center p-6">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading...</p>
          </div>
        </DialogContent>
      </Dialog>

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
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
        onRowClick={(row) => {
          setIsLoading(true);
          router.push(`/dashboard/projects/${row.original.id}`);
        }}
      />
    </>
  );
};
