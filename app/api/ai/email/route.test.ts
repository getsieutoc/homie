import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';
import { getOpenAIModel } from '@/lib/openai';

vi.mock('@/lib/openai', () => ({
  getOpenAIModel: () => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Generated email content' } }],
        }),
      },
    },
  }),
}));

describe('Email Generation API', () => {
  it('should generate email content successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/email', {
      method: 'POST',
      body: JSON.stringify({
        result: 'test result',
        engineName: 'test engine',
        projectDomain: 'test.com',
        resultCategory: 'test category',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toEqual({ emailContent: 'Generated email content' });
  });

  it('should handle invalid input data', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai/email', {
      method: 'POST',
      body: JSON.stringify({
        // Missing required fields
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });
});
