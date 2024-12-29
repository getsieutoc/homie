import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL!,
  apiKey: process.env.OPENAI_API_KEY!,
  // compatibility: 'compatible', // strict mode, enable when using the OpenAI API
});

export const getOpenAIModel = (modelName = 'gpt-4o', options = {}) => {
  return openai(modelName, options);
};
