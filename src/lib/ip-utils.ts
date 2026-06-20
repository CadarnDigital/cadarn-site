import { createHmac } from 'crypto';

// Use the last hop of XFF — appended by Vercel's edge (not spoofable by the client).
export const getClientIp = (request: Request): string => {
  const xff = request.headers.get('x-forwarded-for') ?? '';
  const parts = xff.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : (request.headers.get('x-real-ip') ?? 'unknown');
};

// HMAC-SHA256 pseudonymization — requires IP_HASH_PEPPER env var.
// Fails loudly on missing pepper instead of silently storing raw IPs.
export const pseudonymizeIp = (ip: string): string => {
  const pepper = import.meta.env.IP_HASH_PEPPER;
  if (!pepper) throw new Error('IP_HASH_PEPPER não configurado');
  return createHmac('sha256', pepper).update(ip).digest('hex');
};
