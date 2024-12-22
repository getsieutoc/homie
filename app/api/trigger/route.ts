import { NextRequest, NextResponse } from 'next/server';
import { checkDomain } from '@/services/virustotal';
import { type VirusTotalResult } from '@/types';
import { prisma } from '@/lib/prisma-client';
import { headers } from 'next/headers';

function isIssue(result: VirusTotalResult) {
  return result.result !== 'clean' && result.result !== 'unrated';
}

export async function POST(req: NextRequest) {
  try {
    // Get the host domain of the request
    const host = req.headers.get('host');

    // Verify cron secret to ensure request is authorized
    const headersList = headers();
    const cronSecret = headersList.get('x-cron-secret');

    // Log or use the host as needed
    console.log('Request from host:', host);

    if (cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active projects
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        domain: true,
      },
    });

    const results = await Promise.all(
      projects.map(async (project) => {
        try {
          const vtResponse = await checkDomain(project.domain);
          const analysisResults = vtResponse.data.attributes.last_analysis_results;

          // Find results that indicate issues
          const issueResults = Object.entries(analysisResults)
            .filter(([_, result]: [string, any]) => isIssue(result))
            .map(([engineName, result]: [string, any]) => ({
              projectId: project.id,
              engineName,
              result: result.result,
              category: result.category || null,
              method: result.method || null,
            }));

          // Store results in database
          if (issueResults.length > 0) {
            await prisma.result.createMany({
              data: issueResults,
            });
          }

          return {
            domain: project.domain,
            issuesCount: issueResults.length,
            issues: issueResults,
          };
        } catch (error) {
          console.error(`Error processing domain ${project.domain}:`, error);
          return {
            domain: project.domain,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
