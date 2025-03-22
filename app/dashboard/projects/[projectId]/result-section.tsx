import {
  CircleCheckBig,
  AlertTriangle,
  CircleHelp,
  Minus,
  SendHorizonal,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Project, type ResultWithPayload } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useState } from 'react';

import { EmailModal } from './email-modal';

type DetailedResults = {
  type: string;
  items: ResultWithPayload[];
}[];

export const ResultSection = ({
  type,
  items,
  project,
}: DetailedResults[number] & { project: Project }) => {
  const isMalicious = ['malicious', 'suspicious', 'phishing'].includes(type);
  const isClean = type === 'clean';

  const [selectedResult, setSelectedResult] = useState<ResultWithPayload | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleGenerateEmail = (result: ResultWithPayload) => {
    setSelectedResult(result);
    setIsEmailModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle
          className={`text-md flex w-full items-center justify-between gap-2 font-medium ${
            isClean ? 'text-green-600' : isMalicious ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {isClean ? (
              <CircleCheckBig className="h-4 w-4" />
            ) : isMalicious ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CircleHelp className="h-4 w-4" />
            )}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>

          <div className="flex items-end gap-1">
            <span
              className={`text-2xl font-bold ${
                isClean
                  ? 'text-green-600'
                  : isMalicious
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {items.length}
            </span>
            <span>vendors</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {items.length > 0 && (
            <ScrollArea className="h-[300px] w-full rounded-md border py-2">
              <div>
                {items.map((result, index) => {
                  if (isMalicious) {
                    console.log('Rendering result:', result);
                  }
                  return (
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
                                <span>
                                  {format(result.disputedAt, 'dd.MM.yyyy HH:mm')}
                                </span>
                              ) : (
                                <Minus className="h-4 w-4" />
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {isMalicious && (
                        <div className="mt-2 flex items-center justify-start gap-2 px-4 pb-4">
                          {result.vendor.email && (
                            <Button
                              onClick={() => handleGenerateEmail(result)}
                              variant="warning"
                              size="xs"
                            >
                              <SendHorizonal className="mr-2 h-3 w-3" />
                              Send Dispute Email
                            </Button>
                          )}

                          {result.vendor.url && (
                            <Button
                              onClick={() => window.open(result.vendor.url!, '_blank')}
                              variant="info"
                              size="xs"
                            >
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Submit Form
                            </Button>
                          )}

                          {!result.vendor.email && !result.vendor.url && (
                            <p className="text-xs text-muted-foreground">
                              No dispute method available
                            </p>
                          )}
                        </div>
                      )}

                      {items.length !== 1 && items.length !== index + 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                })}
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
