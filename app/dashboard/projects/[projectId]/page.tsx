import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { getProjectById } from '@/services/projects';
import { getResultStats, getResults } from '@/services/results';
import { Suspense } from 'react';
import { type Metadata } from 'next';

import { ProjectView } from './project-view';

type PageProps = { params: { projectId: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { project } = await getProjectById(params.projectId);

  return {
    title: `Project: ${project.domain}`,
    description: project.description || 'No description',
  };
}

export default async function SingleProjectPage({ params }: PageProps) {
  const { project, schedule } = await getProjectById(params.projectId);
  const stats = await getResultStats({ projectId: params.projectId });

  // Get all unique result values from stats
  const resultTypes = stats.map((s) => s.result);

  // Fetch detailed results for each result type
  const detailedResults = await Promise.all(
    resultTypes.map(async (result) => {
      const results = await getResults({
        where: {
          projectId: params.projectId,
          result,
        },
      });
      return {
        type: result,
        items: results,
      };
    })
  );

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProjectView
            project={project}
            schedule={schedule}
            stats={stats}
            detailedResults={detailedResults}
          />
        </Suspense>
      </div>
    </PageContainer>
  );
}
