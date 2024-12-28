'use client';

import { useEffect, useState } from 'react';
import { getResults } from '@/services/results';
import { type Result } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export type Props = {
  projectId: string;
  result: string;
};

export const ResultList = ({ projectId, result }: Props) => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getResults({
          where: {
            projectId,
            result,
          },
        });
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [projectId, result]);

  if (loading) {
    return <Skeleton className="h-4 w-1/4" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-destructive">Error: {error}</CardContent>
      </Card>
    );
  }

  if (!results.length) {
    return (
      <Card>
        <CardContent className="p-4 text-muted-foreground">No results found</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((item, index) => (
        <Card key={`${item.engineName}-${index}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{item.engineName}</div>
              <Badge
                variant={
                  item.result === 'clean'
                    ? 'default'
                    : item.result === 'malicious'
                    ? 'destructive'
                    : item.result === 'suspicious'
                    ? 'warning'
                    : 'secondary'
                }
              >
                {item.result}
              </Badge>
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">{item.method}</Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
