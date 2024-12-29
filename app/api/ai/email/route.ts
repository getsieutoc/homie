import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/constants';
import { getOpenAIModel } from '@/lib/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export type Result = {
  result: string;
  engineName: string;
  projectDomain: string;
  resultCategory: string;
};

const resultSchema = z.object({
  result: z.string(),
  engineName: z.string(),
  projectDomain: z.string(),
  resultCategory: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resultSchema.parse(body);

    const emailPrompt = `We received the result "${validatedData.result}" from ${validatedData.engineName}, as our domain has been ${validatedData.projectDomain} and is listed in ${validatedData.resultCategory}.
    Write a dispute message and send to them. The response should be formatted as follows:
      - subject: A clear and concise subject line
      - content: ONLY the body of the email, do not include any subject line or other metadata in the content field`;

    const { object } = await generateObject({
      model: getOpenAIModel(),
      schema: z.object({
        subject: z.string().describe('The email subject line'),
        content: z
          .string()
          .describe(
            'ONLY the body content of the email, do not include subject or other metadata'
          ),
      }),
      system: SYSTEM_PROMPT,
      prompt: emailPrompt,
      seed: Date.now(),
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Failed to generate email content' },
      { status: 500 }
    );
  }
}
