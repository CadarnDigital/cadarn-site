-- scan_leads: leads captados pelo formulário do Scan de Autoridade
create table if not exists scan_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  instagram   text not null,
  segment     text not null,
  whatsapp    text not null,
  is_decision_maker text not null check (is_decision_maker in ('sim', 'influencio', 'nao'))
);

-- newsletter_subscribers: inscrições do bloco de newsletter
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text not null unique,
  name       text
);

-- scan_rate_limits: rate limiting persistente (substitui in-memory)
create table if not exists scan_rate_limits (
  ip         text not null,
  date       date not null default current_date,
  count      integer not null default 1,
  primary key (ip, date)
);

-- RLS: desabilitar acesso público de leitura, permitir insert via service role
alter table scan_leads enable row level security;
alter table newsletter_subscribers enable row level security;
alter table scan_rate_limits enable row level security;

-- Apenas service role pode inserir/ler (API routes usam service role key)
create policy "service role only" on scan_leads
  for all using (auth.role() = 'service_role');

create policy "service role only" on newsletter_subscribers
  for all using (auth.role() = 'service_role');

create policy "service role only" on scan_rate_limits
  for all using (auth.role() = 'service_role');
