import { Mastra } from '@mastra/core';
import { securityAnalyst } from './agents/security-analyst';
import { defaultWorkflow } from './workflows/default';

export const mastra = new Mastra({
  agents: { securityAnalyst },
  workflows: { defaultWorkflow },
});
