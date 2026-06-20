import type { APIRoute } from 'astro';
import { createHash } from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

const POLICY_VERSION = 'v1.0';

const hashIp = (ip: string): string =>
  createHash('sha256').update(ip).digest('hex');

const getClientIp = (request: Request): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  request.headers.get('x-real-ip') ||
  'unknown';

export const POST: APIRoute = async ({ request }) => {
  let body: {
    name: string;
    instagram: string;
    segment: string;
    whatsapp: string;
    isDecisionMaker: string;
    consentGiven?: boolean;
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

  const clientIp = getClientIp(request);

  const { error } = await supabaseAdmin.from('scan_leads').insert({
    name: body.name,
    instagram: body.instagram,
    segment: body.segment,
    whatsapp: body.whatsapp,
    is_decision_maker: body.isDecisionMaker,
    consent_given: body.consentGiven === true,
    consent_timestamp: body.consentGiven ? new Date().toISOString() : null,
    consent_ip_hash: body.consentGiven ? hashIp(clientIp) : null,
    policy_version: body.consentGiven ? POLICY_VERSION : null,
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
