import { NextResponse } from 'next/server';

const schema = {
  openapi: '3.1.0',
  info: {
    title: 'ADSO GPT Actions API',
    version: '1.0.0',
    description: 'Secure bridge between GPT Actions and Françoise, ADSO AI Executive.',
  },
  servers: [{ url: process.env.NEXTAUTH_URL || 'https://adso-safety.vercel.app' }],
  paths: {
    '/api/gpt/v1/status': {
      get: {
        operationId: 'getAdsoStatus',
        summary: 'Read ADSO operational status and high-level metrics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'ADSO status' },
          '401': { description: 'Unauthorized' },
          '503': { description: 'Integration not configured' },
        },
      },
    },
    '/api/gpt/v1/francoise': {
      post: {
        operationId: 'askFrancoise',
        summary: 'Ask Françoise, the ADSO AI Executive',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['question'],
                properties: {
                  question: { type: 'string', maxLength: 4000 },
                  language: { type: 'string', description: 'Preferred response language, for example fr, en, ar or pt.' },
                  mode: { type: 'string', description: 'Executive, presenter, institutional, CTO, CMO, CPO or negotiator.' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Françoise response' },
          '400': { description: 'Invalid request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Assistant unavailable' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'ADSO GPT Action Key',
      },
    },
  },
} as const;

export async function GET() {
  return NextResponse.json(schema, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
