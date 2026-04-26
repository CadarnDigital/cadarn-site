import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: {
    name: string;
    instagram: string;
    segment: string;
    whatsapp: string;
    isDecisionMaker: string;
    honeypot?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot — silently succeed for bots
  if (body.honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabaseAdmin.from('scan_leads').insert({
    name: body.name,
    instagram: body.instagram,
    segment: body.segment,
    whatsapp: body.whatsapp,
    is_decision_maker: body.isDecisionMaker,
  });

  if (error) {
    return new Response(JSON.stringify({ error: 'Erro ao salvar lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
