import { type Project } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  ClockIcon,
  Globe2Icon,
  TimerIcon,
  CircleCheckBig,
  AlertTriangle,
  CircleHelp,
  AlertCircle,
} from 'lucide-react';
import { type Stats, type Result } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type DetailedResults = {
  type: string;
  items: Result[];
}[];

export type Props = {
  project: Project;
  stats?: Stats;
  detailedResults?: DetailedResults;
};

const ResultSection = ({ type, items }: DetailedResults[number]) => {
  const isMalicious = ['malicious', 'suspicious', 'phishing'].includes(type);
  const isClean = type === 'clean';

  return (
    <Card className={isMalicious ? 'md:col-span-2' : ''}>
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
                    <AlertCircle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        isClean
                          ? 'text-green-600'
                          : isMalicious
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    />
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
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function ProjectView({ project, stats, detailedResults }: Props) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Globe2Icon className="h-5 w-5" />
              {project.domain}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {project.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant={!project.deletedAt ? 'default' : 'secondary'}>
            {!project.deletedAt ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
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
              <Label className="text-xs text-muted-foreground">Schedule</Label>
              <p className="font-mono text-sm font-medium">{project.cron}</p>
            </div>
          </div>
        </div>

        {stats && stats.length > 0 && detailedResults && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">VirusTotal Results</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {detailedResults.map((result) => (
                  <ResultSection
                    key={result.type}
                    type={result.type}
                    items={result.items}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
