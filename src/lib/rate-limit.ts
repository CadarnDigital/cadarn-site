import { supabaseAdmin } from './supabase';
import { pseudonymizeIp } from './ip-utils';

type RateLimitTable = 'scan_rate_limits' | 'newsletter_rate_limits';

/**
 * Returns true if the IP has exceeded maxPerDay requests today.
 * Hashes the IP before storing — no raw IPs in the rate limit tables.
 */
export const isRateLimited = async (
  ip: string,
  table: RateLimitTable,
  maxPerDay: number,
): Promise<boolean> => {
  const today = new Date().toISOString().slice(0, 10);
  const ipHash = pseudonymizeIp(ip);

  const { data } = await supabaseAdmin
    .from(table)
    .select('count')
    .eq('ip', ipHash)
    .eq('date', today)
    .maybeSingle();

  const current = data?.count ?? 0;
  if (current >= maxPerDay) return true;

  if (current === 0) {
    await supabaseAdmin.from(table).insert({ ip: ipHash, date: today, count: 1 });
  } else {
    await supabaseAdmin.from(table).update({ count: current + 1 }).eq('ip', ipHash).eq('date', today);
  }

  return false;
};
