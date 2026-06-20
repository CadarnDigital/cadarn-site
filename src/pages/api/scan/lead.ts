import type { APIRoute } from 'astro';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

const POLICY_VERSION = 'v1.0';

// Pseudonymize IP with HMAC-SHA256 + server-side pepper.
// Pepper rotação: ao trocar IP_HASH_PEPPER, hashes antigos deixam de ser
// reproduzíveis — planejado e aceitável (fins de auditoria, não de rastreio).
const pseudonymizeIp = (ip: string): string => {
  const pepper = import.meta.env.IP_HASH_PEPPER;
  if (!pepper) throw new Error('IP_HASH_PEPPER não configurado');
  return createHmac('sha256', pepper).update(ip).digest('hex');
};

// Use o último hop do XFF (inserido pelo edge Vercel — não spoofável pelo cliente).
const getClientIp = (request: Request): string => {
  const xff = request.headers.get('x-forwarded-for') ?? '';
  const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : (request.headers.get('x-real-ip') ?? 'unknown');
};

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

  // Guard de base legal LGPD — consentimento é obrigatório para inserção
  if (body.consentGiven !== true) {
    return new Response(
      JSON.stringify({ error: 'Consentimento obrigatório' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const clientIp = getClientIp(request);

  const { error } = await supabaseAdmin.from('scan_leads').insert({
    name: body.name,
    instagram: body.instagram,
    segment: body.segment,
    whatsapp: body.whatsapp,
    is_decision_maker: body.isDecisionMaker,
    consent_given: true,
    consent_timestamp: new Date().toISOString(),
    consent_ip_hash: pseudonymizeIp(clientIp),
    policy_version: POLICY_VERSION,
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
