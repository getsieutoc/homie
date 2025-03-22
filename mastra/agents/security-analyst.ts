import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const securityAnalyst = new Agent({
  name: 'Security Analyst',
  instructions: 'You are a helpful security analyst.',
  model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
});
