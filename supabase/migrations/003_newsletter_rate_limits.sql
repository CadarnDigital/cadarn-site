-- Rate limiting para o endpoint /api/newsletter/subscribe.
-- Mesmo padrão da tabela scan_rate_limits — ip é hash HMAC-SHA256 (não raw).

create table if not exists newsletter_rate_limits (
  ip   text        not null,
  date date        not null,
  count integer    not null default 1,
  primary key (ip, date)
);
