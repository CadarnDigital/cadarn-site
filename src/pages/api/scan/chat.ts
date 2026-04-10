import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { SCAN_SYSTEM_PROMPT } from '../../../lib/scan-system-prompt';

export const prerender = false;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Rate limiting (in-memory, MVP) ---
interface RateLimitEntry {
  count: number;
  date: string; // YYYY-MM-DD
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS_PER_DAY = 3;

const getClientIp = (request: Request): string => {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
};

const getTodayKey = (): string => {
  return new Date().toISOString().slice(0, 10);
};

const isRateLimited = (ip: string): boolean => {
  const today = getTodayKey();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.date !== today) {
    rateLimitMap.set(ip, { count: 1, date: today });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_DAY) {
    return true;
  }

  entry.count += 1;
  return false;
};

// --- Honeypot generic response ---
const HONEYPOT_RESPONSE = 'Obrigado pelo interesse! Em breve entraremos em contato.';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key não configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages: ChatMessage[]; honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Body inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Honeypot check — silently return generic response for bots
  if (body.honeypot) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: HONEYPOT_RESPONSE })}\n\n`)
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  // Rate limiting check
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Limite de scans diários atingido. Tente novamente amanhã.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Messages obrigatório' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SCAN_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};
