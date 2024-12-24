import { NextResponse, NextRequest } from 'next/server';
import { checkDomain } from '@/services/virustotal';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/auth';

type VirusTotalRequest = {
  projectId: string;
};

export async function POST(req: NextRequest) {
  const { session } = await getAuth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId }: VirusTotalRequest = await req.json();

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: {
        id: true,
        domain: true,
      },
    });

    const response = await checkDomain(project.domain);

    const results = Object.values(response.data.attributes.last_analysis_results);

    for (const result of results) {
      await prisma.result.upsert({
        where: {
          projectId_engineName: {
            projectId: project.id,
            engineName: result.engine_name,
          },
        },
        update: {
          category: result.category,
          method: result.method,
          result: result.result,
        },
        create: {
          projectId: project.id,
          engineName: result.engine_name,
          result: result.result,
          category: result.category,
          method: result.method,
        },
      });
    }

    return NextResponse.json(
      { message: 'Domain check completed', data: response.data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something wrong with trigger check' },
      { status: 500 }
    );
  }
}
