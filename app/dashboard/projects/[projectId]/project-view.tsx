'use client';

import {
  type Stats,
  type TriggerSchedule,
  type Project,
  ResultWithPayload,
} from '@/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

import { ResultSection } from './result-section';

type DetailedResults = {
  type: string;
  items: ResultWithPayload[];
}[];

export type Props = {
  project: Project;
  schedule: TriggerSchedule;
  stats?: Stats;
  detailedResults?: DetailedResults;
};

export const ProjectView = ({ project, schedule, stats, detailedResults }: Props) => {
  return (
    <div className="w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-2xl font-bold">
              {project.domain}
            </div>
            <div className="text-sm text-muted-foreground">
              {project.description || 'No description provided'}
            </div>
          </div>
          <Badge variant="outline" colorScheme={project.deletedAt ? 'danger' : 'success'}>
            {!project.deletedAt ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="font-mono text-sm font-medium">
                {format(project.createdAt, 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Last Updated</Label>
              <p className="font-mono text-sm font-medium">
                {format(project.updatedAt, 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Next run:</Label>
              <p className="font-mono text-sm font-medium">
                {schedule.nextRun ? format(schedule.nextRun, 'dd.MM.yyyy HH:mm') : '-'}
              </p>
            </div>
          </div>
        </div>

        {stats && stats.length > 0 && detailedResults && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Checking Results from Security Vendors
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {detailedResults.map((result) => (
                  <ResultSection
                    key={result.type}
                    type={result.type}
                    items={result.items}
                    project={project}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
