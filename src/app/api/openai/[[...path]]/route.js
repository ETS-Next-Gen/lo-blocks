// src/app/api/openai/[[...path]]/route.js
//
// Proxy for OpenAI chat completions. Only POST to chat/completions is supported.
// Model is controlled server-side via OPENAI_MODEL env var.

import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/";
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-nano';

const USE_STUB = !OPENAI_API_KEY || process.env.LLM_MODE === 'STUB';

if (USE_STUB) {
  console.log('\n⚠️  LLM running in STUB mode - responses are fake.\n' +
    '   To use real OpenAI, set OPENAI_API_KEY and restart:\n' +
    '     export OPENAI_API_KEY=sk-...\n' +
    '   Or add it to .env.local\n');
}

export async function POST(request) {
  const body = await request.json();
  body.model = OPENAI_MODEL;

  if (USE_STUB) {
    console.log(`🤖 Using OpenAI stub`);
    return stubResponse(body);
  }

  const response = await fetch(`${OPENAI_BASE_URL}chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Stub for development/testing without API key
function stubResponse(body) {
  const messages = body.messages || [];
  const userMessage = messages.find(m => m.role === 'user')?.content || 'Hello';
  const preview = userMessage.substring(0, 150) + (userMessage.length > 150 ? '...' : '');

  let responseText;
  const lower = userMessage.toLowerCase();
  if (lower.includes('comedian')) {
    responseText = `[STUB COMEDIAN] "${preview}" → "Why did the student write this? Because they had something important to say... and I'm making it funny! 🎭"`;
  } else if (lower.includes('first grader')) {
    responseText = `[STUB FIRST GRADER] "${preview}" → "This is easy words for little kids to read!"`;
  } else if (lower.includes('business')) {
    responseText = `[STUB BUSINESS] "${preview}" → "We are pleased to leverage synergistic solutions..."`;
  } else if (lower.includes('legal')) {
    responseText = `[STUB LEGAL] "${preview}" → "Whereas the aforementioned content, hereinafter referred to as..."`;
  } else if (lower.includes('academic')) {
    responseText = `[STUB ACADEMIC] "${preview}" → "The hermeneutical implications of the aforementioned discourse..."`;
  } else {
    responseText = `[STUB] Processed: "${preview}"`;
  }

  return NextResponse.json({
    id: 'stub-completion-id',
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: OPENAI_MODEL,
    choices: [{
      index: 0,
      message: { role: 'assistant', content: responseText },
      finish_reason: 'stop'
    }],
    usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
  });
}
