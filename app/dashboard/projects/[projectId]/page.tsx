import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { getProjectById } from '@/services/projects';
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
  const { project } = await getProjectById(params.projectId);

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProjectView project={project} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
