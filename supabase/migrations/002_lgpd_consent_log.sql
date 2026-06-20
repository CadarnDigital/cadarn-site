-- NFR14 v3.0: campos de log de consentimento LGPD obrigatórios
-- Base legal = consentimento; log persiste timestamp, IP anonimizado e versão da política

alter table scan_leads
  add column if not exists consent_given       boolean not null default false,
  add column if not exists consent_timestamp   timestamptz,
  add column if not exists consent_ip_hash     text,       -- SHA-256 do IP, nunca raw
  add column if not exists policy_version      text;       -- ex: 'v1.0'
