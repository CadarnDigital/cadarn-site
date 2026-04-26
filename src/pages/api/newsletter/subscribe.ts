import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { email: string; name?: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.email || !body.email.includes('@')) {
    return new Response(JSON.stringify({ error: 'E-mail inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error } = await supabaseAdmin.from('newsletter_subscribers').upsert(
    { email: body.email.toLowerCase().trim(), name: body.name?.trim() || null },
    { onConflict: 'email', ignoreDuplicates: true }
  );

  if (error) {
    return new Response(JSON.stringify({ error: 'Erro ao salvar inscrição' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
