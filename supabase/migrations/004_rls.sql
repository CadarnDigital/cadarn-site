-- Row Level Security em todas as tabelas do cadarn-site.
-- Service role bypassa RLS — acesso total via API routes (comportamento esperado).
-- Anon key não tem políticas → acesso bloqueado por padrão → correto para tabelas internas.

alter table scan_leads             enable row level security;
alter table scan_rate_limits       enable row level security;
alter table newsletter_subscribers enable row level security;
alter table newsletter_rate_limits enable row level security;
