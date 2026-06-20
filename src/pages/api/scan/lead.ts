import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { getClientIp, pseudonymizeIp } from '../../../lib/ip-utils';
import { isRateLimited } from '../../../lib/rate-limit';

export const prerender = false;

const POLICY_VERSION = 'v1.0';
const MAX_LEADS_PER_DAY = 5;

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

  if (await isRateLimited(clientIp, 'scan_rate_limits', MAX_LEADS_PER_DAY)) {
    return new Response(
      JSON.stringify({ error: 'Limite diário de envios atingido. Tente novamente amanhã.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Guard de base legal LGPD — consentimento é obrigatório para inserção
  if (body.consentGiven !== true) {
    return new Response(
      JSON.stringify({ error: 'Consentimento obrigatório' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

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
