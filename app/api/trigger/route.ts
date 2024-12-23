import { NextResponse, NextRequest } from 'next/server';
import { checkDomain } from '@/services/virustotal';
import { IS_PRODUCTION } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-secret');
  const origin = req.headers.get('origin');

  if (!secret || secret !== process.env.TRIGGER_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!IS_PRODUCTION) {
    console.log('Received  origin:', origin);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        domain: true,
      },
    });

    for (const project of projects) {
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
    }

    return NextResponse.json({ message: 'Domain check completed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Something wrong with trigger check' },
      { status: 500 }
    );
  }
}
