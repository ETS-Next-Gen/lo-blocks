// src/app/api/openai/[[...path]]/route.js

// Critical TODO: Add filtering, rate limiting, etc.

import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = "https://api.openai.com/v1/";
const USE_STUB = !OPENAI_API_KEY || process.env.NODE_ENV === 'development';

export async function GET(request, { params }) {
  return proxyToOpenAI(request, params);
}
export async function POST(request, { params }) {
  return proxyToOpenAI(request, params);
}
export async function PUT(request, { params }) {
  return proxyToOpenAI(request, params);
}
export async function DELETE(request, { params }) {
  return proxyToOpenAI(request, params);
}

// Stub implementation for development/testing
async function stubOpenAI(request, path) {
  // Handle chat completions specifically
  if (path === 'chat/completions' && request.method === 'POST') {
    const body = await request.json();
    const messages = body.messages || [];
    const userMessage = messages.find(m => m.role === 'user')?.content || 'Hello';

    // Generate a simple response based on the prompt
    let responseText = `Hello! This is a stub response to: "${userMessage.substring(0, 100)}${userMessage.length > 100 ? '...' : ''}"`;

    // Add some variety based on prompt content
    if (userMessage.toLowerCase().includes('comedian')) {
      responseText = "Why did the text go to therapy? Because it had too many character issues! 😄 (This is a stub response for testing.)";
    } else if (userMessage.toLowerCase().includes('first grader')) {
      responseText = "Hi! I am a computer helper. I can make words easy to read! (This is a test message.)";
    } else if (userMessage.toLowerCase().includes('business')) {
      responseText = "Dear Valued Stakeholder, we are pleased to present this synergistic solution... (Stub response for development testing.)";
    } else if (userMessage.toLowerCase().includes('legal')) {
      responseText = "Whereas the aforementioned text, hereinafter referred to as 'the Content'... (Mock legal text for testing purposes.)";
    }

    return NextResponse.json({
      id: 'stub-completion-id',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: body.model || 'gpt-3.5-turbo',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: responseText
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30
      }
    });
  }

  // Generic stub response for other endpoints
  return NextResponse.json({
    message: 'Stub OpenAI API endpoint',
    path,
    method: request.method
  });
}

// Generic proxy handler for all methods
async function proxyToOpenAI(request, params) {
  const path = (await params).path ? (await params).path.join('/') : '';

  // Use stub if no API key is configured or in development
  if (USE_STUB) {
    console.log(`🤖 Using OpenAI stub for ${request.method} /${path}`);
    return stubOpenAI(request, path);
  }

  const url = `${OPENAI_BASE_URL}${path}${request.nextUrl.search}`;

  // Copy headers, replace Authorization
  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${OPENAI_API_KEY}`);
  headers.set('Content-Type', 'application/json');

  // Remove headers that shouldn't be forwarded
  headers.delete('host');
  headers.delete('content-length');

  // Pass through body for methods that support it
  const body = ['POST', 'PUT', 'PATCH'].includes(request.method)
    ? await request.text()
    : undefined;

  // Fetch from OpenAI
  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    duplex: 'half', // Needed for edge runtime streaming; safe to include
  });

  // Pass through status and headers
  const res = new NextResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
      // Add any other headers as needed
    },
  });
  return res;
}
