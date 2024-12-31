import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheckBig, AlertTriangle, CircleHelp, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Project, type Result } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { useState } from 'react';

import { EmailModal } from '../_components/email-modal';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type DetailedResults = {
  type: string;
  items: Result[];
}[];

export const ResultSection = ({
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
            <ScrollArea className="h-[300px] w-full rounded-md border py-2">
              <div>
                {items.map((result, index) => (
                  <div
                    key={result.engineName}
                    className="flex w-full flex-col items-start"
                  >
                    <div className="flex w-full items-center justify-between px-4 py-4">
                      <p className="text-sm font-medium">{result.engineName}</p>

                      <Badge
                        variant="outline"
                        className={
                          isClean
                            ? 'text-green-600'
                            : isMalicious
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }
                      >
                        {result.result}
                      </Badge>
                    </div>

                    {isMalicious && (
                      <div className="flex w-full items-start justify-start gap-4 px-4 text-xs">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Dispute Count:
                          </Label>
                          <p className="text-sm font-medium">{result.disputeCount}</p>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Disputed At:
                          </Label>
                          <p className="text-sm font-medium">
                            {result.disputedAt ? (
                              <span>{format(result.disputedAt, 'dd.MM.yyyy HH:mm')}</span>
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {isMalicious && (
                      <div className="mt-2 flex items-center justify-start gap-2 px-4">
                        <Badge
                          onClick={() => handleGenerateEmail(result)}
                          className="hover:cursor-pointer"
                          variant="default"
                        >
                          Generate Dispute
                        </Badge>
                      </div>
                    )}

                    {items.length !== 1 && items.length !== index + 1 && (
                      <Separator className="my-2" />
                    )}
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
