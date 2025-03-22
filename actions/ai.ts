'use server';

import { emailSchema, resultSchema } from '@/lib/zod-schemas';
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
      schema: emailSchema,
      system: SYSTEM_PROMPT,
      prompt: emailPrompt,
      seed: Date.now(),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
};
