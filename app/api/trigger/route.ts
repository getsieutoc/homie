import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { checkDomain } from '@/services/virustotal';

export async function POST(req: NextApiRequest) {
  // Check the trigger source
  // if (req.headers['trigger-source'] !== process.env.TRIGGER_URL) {
  //   return NextResponse.json({ error: 'Forbidden' });
  // }

  try {
    // Fetch all projects' domains
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        domain: true,
      },
    });

    for (const project of projects) {
      try {
        const response = await checkDomain(project.domain);
        console.log(`VirusTotal results for ${project.domain}:`, response);
        const results = Object.values(response.data.attributes.last_analysis_results);
        console.log(`Results for ${project.domain}:`, results);

        for (const result of results) {
          // Assume you process the response here
          await prisma.result.upsert({
            where: {
              projectId_engineName: {
                projectId: project.id,
                engineName: result.engine_name,
              },
            },
            update: {
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
      } catch (error) {
        console.error(`Error checking domain ${project.domain}:`, error);
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
