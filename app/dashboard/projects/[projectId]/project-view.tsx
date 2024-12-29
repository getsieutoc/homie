'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarIcon,
  ClockIcon,
  Globe2Icon,
  TimerIcon,
  CircleCheckBig,
  AlertTriangle,
  CircleHelp,
} from 'lucide-react';
import { type Stats, type Result, type TriggerSchedule, type Project } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { format } from 'date-fns';
import { useState } from 'react';
import { EmailModal } from '../_components/email-modal';

type DetailedResults = {
  type: string;
  items: Result[];
}[];

export type Props = {
  project: Project;
  schedule: TriggerSchedule;
  stats?: Stats;
  detailedResults?: DetailedResults;
};

const ResultSection = ({
  type,
  items,
  project,
}: DetailedResults[number] & { project: Project }) => {
  const isMalicious = ['malicious', 'suspicious', 'phishing'].includes(type);
  const isClean = type === 'clean';
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleGenerateEmail = (result: Result) => {
    setSelectedResult(result);
    setIsEmailModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle
          className={`flex items-center gap-2 text-sm font-medium ${
            isClean ? 'text-green-600' : isMalicious ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {isClean ? (
            <CircleCheckBig className="h-4 w-4" />
          ) : isMalicious ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CircleHelp className="h-4 w-4" />
          )}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </CardTitle>
        {items.length > 0 && (
          <CardDescription>
            {items.length} {items.length === 1 ? 'vendor' : 'vendors'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p
            className={`text-2xl font-bold ${
              isClean ? 'text-green-600' : isMalicious ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {items.length}
          </p>
          {items.length > 0 && (
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-3">
                {items.map((result) => (
                  <div key={result.engineName} className="flex items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{result.engineName}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.result}
                        </Badge>
                        {result.category && (
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      {result.method && (
                        <p className="text-xs text-muted-foreground">
                          Method: {result.method}
                        </p>
                      )}

                      {isMalicious && (
                        <Button
                          onClick={() => handleGenerateEmail(result)}
                          className="ml-auto"
                          size="sm"
                        >
                          Generate Dispute Email
                        </Button>
                      )}

                      {result.lastMessage && (
                        <div className="mt-2 space-y-1 rounded-md bg-muted p-2">
                          <p className="text-xs font-medium">Generated Email:</p>
                          <p className="text-xs text-muted-foreground">
                            {result.lastMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
      {selectedResult && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedResult(null);
          }}
          result={selectedResult}
          project={project}
        />
      )}
    </Card>
  );
};

export function ProjectView({ project, schedule, stats, detailedResults }: Props) {
  return (
    <div className="w-full">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe2Icon className="h-5 w-5" />
              {project.domain}
            </div>
            <div className="text-sm text-muted-foreground">
              {project.description || 'No description provided'}
            </div>
          </div>
          <Badge variant={!project.deletedAt ? 'default' : 'secondary'}>
            {!project.deletedAt ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="text-sm font-medium">
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Last Updated</Label>
              <p className="text-sm font-medium">
                {new Date(project.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TimerIcon className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Next run:</Label>
              <p className="font-mono text-sm font-medium">
                {format(schedule.nextRun!, 'dd.MM.yyyy HH:mm')}
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
}
