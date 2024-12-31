import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/constants';
import { getOpenAIModel } from '@/lib/openai';
import { emailSchema } from '@/lib/zod-schemas';
import { streamObject } from 'ai';
import { z } from 'zod';

const requestSchema = z.object({
  result: z.string(),
  engineName: z.string(),
  projectDomain: z.string(),
  resultCategory: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inputs = requestSchema.parse(body);

    const emailPrompt = `
    We received the result "${inputs.result}" from ${inputs.engineName}, as our domain has been ${inputs.projectDomain} and is listed in ${inputs.resultCategory}.
    Write a dispute message and send to them. The response should be formatted as follows:
      - subject: A clear and concise subject line
      - content: ONLY the body of the email, do not include any subject line or other metadata in the content field`;

    const result = streamObject({
      model: getOpenAIModel(),
      system: SYSTEM_PROMPT,
      prompt: emailPrompt,
      schema: emailSchema,
      seed: Date.now(),
    });

    return result.toTextStreamResponse();
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to generate email content' },
      { status: 500 }
    );
  }
}
