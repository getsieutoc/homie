import { resultSchema } from '@/lib/zod-schemas';
import { Step, Workflow } from '@mastra/core';
// import { z } from 'zod';

const gatherInformationStep = new Step({
  id: 'gather-information',
  description: 'Gather initial information of checking result.',
  // They are aware of this issue https://github.com/mastra-ai/mastra/issues/2819
  inputSchema: resultSchema as any,
  execute: async (input) => {
    // console.log('Gathering information...');
    return input;
  },
});

const defaultWorkflow = new Workflow({
  name: 'default-workflow',
  // triggerSchema: z.object({
  //   inputValue: z.number(),
  // }),
});
