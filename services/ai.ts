'use server';

import { SYSTEM_PROMPT } from '@/lib/constants';
import { createStreamableValue } from 'ai/rsc';
import { getOpenAIModel } from '@/lib/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export type ResultInput = {
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

export const generateEmail = async (input: ResultInput) => {
  const stream = createStreamableValue();

  const validatedData = resultSchema.parse(input);

  const emailPrompt = `We received the result "${validatedData.result}" from ${validatedData.engineName}, as our domain has been ${validatedData.projectDomain} and is listed in ${validatedData.resultCategory}.
    Write a dispute message and send to them. The response should be formatted as follows:
      - subject: A clear and concise subject line
      - content: ONLY the body of the email, do not include any subject line or other metadata in the content field`;

  (async () => {
    const { partialObjectStream } = await streamObject({
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

    for await (const partialObject of partialObjectStream) {
      console.log('partialObject', partialObject);
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
};
