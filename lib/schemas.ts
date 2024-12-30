import { z } from 'zod';

export const emailSchema = z.object({
  subject: z.string().describe('The email subject line'),
  content: z
    .string()
    .describe(
      'ONLY the body content of the email, do not include subject or other metadata'
    ),
});
