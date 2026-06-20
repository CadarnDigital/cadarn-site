-- NFR14 v3.0: log de consentimento LGPD (base legal = consentimento)
-- consent_ip_hash: pseudonimização via HMAC-SHA256 + pepper server-side
-- (NÃO anonimização — identificação indireta ainda é possível com o pepper)

alter table scan_leads
  add column if not exists consent_given       boolean not null default false,
  add column if not exists consent_timestamp   timestamptz,
  add column if not exists consent_ip_hash     text,
  add column if not exists policy_version      text;

-- Garante invariante de base legal: linha só existe se consentimento foi dado.
-- Reforça no DB o guard já presente na API (defesa em profundidade).
alter table scan_leads
  add constraint scan_leads_consent_required
  check (consent_given = true);
