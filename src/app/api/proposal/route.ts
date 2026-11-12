import {NextResponse, type NextRequest} from 'next/server';
import {proposalSchema} from '@/lib/validations/proposal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localHits = new Map<string, {count:number; resetAt:number}>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

function jsonError(status: number, code: string) {
  return NextResponse.json({ok:false, code}, {status, headers:{'Cache-Control':'no-store'}});
}

function clientAddress(request: NextRequest) {
  return request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

async function checkRateLimit(ip: string) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    const key = encodeURIComponent(`proposal:${ip}`);
    const headers = {Authorization:`Bearer ${redisToken}`};
    const base = redisUrl.replace(/\/$/, '');
    const increment = await fetch(`${base}/incr/${key}`, {headers, cache:'no-store'});
    if (!increment.ok) throw new Error('Rate limiter unavailable');
    const result = await increment.json() as {result?:number};
    const count = Number(result.result || 0);
    if (count === 1) {
      const expire = await fetch(`${base}/expire/${key}/${Math.ceil(RATE_WINDOW_MS / 1000)}`, {headers, cache:'no-store'});
      if (!expire.ok) throw new Error('Rate limiter unavailable');
    }
    return count <= RATE_LIMIT;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('Production rate limiter is not configured');

  const now = Date.now();
  const current = localHits.get(ip);
  if (!current || current.resetAt <= now) {
    localHits.set(ip, {count:1, resetAt:now + RATE_WINDOW_MS});
    return true;
  }
  current.count += 1;
  return current.count <= RATE_LIMIT;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character] || character));
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 32000) return jsonError(413, 'PAYLOAD_TOO_LARGE');

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 32000) return jsonError(413, 'PAYLOAD_TOO_LARGE');
    body = JSON.parse(raw);
  } catch { return jsonError(400, 'INVALID_JSON'); }
  const parsed = proposalSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, 'INVALID_FIELDS');

  // A non-empty honeypot is treated as an invalid request without delivering PII.
  if (parsed.data.companyWebsite) return jsonError(400, 'INVALID_FIELDS');

  let allowed: boolean;
  try { allowed = await checkRateLimit(clientAddress(request)); }
  catch { return jsonError(503, 'DELIVERY_UNAVAILABLE'); }
  if (!allowed) return jsonError(429, 'RATE_LIMITED');

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!apiKey || !from || !to) return jsonError(503, 'DELIVERY_UNAVAILABLE');

  const data = parsed.data;
  const rows: [string,string][] = [
    ['Name',data.fullName], ['Company',data.company], ['Work email',data.workEmail], ['Phone',data.phone],
    ['Country',data.country], ['Event type',data.eventType], ['Preferred city',data.city], ['Estimated guests',data.guestCount || 'Not supplied'],
    ['Event start',data.eventStart || 'Not supplied'], ['Event end',data.eventEnd || 'Not supplied'], ['Estimated budget',data.budget || 'Not supplied'],
    ['Services',data.services.join(', ')], ['Additional requirements',data.requirements || 'Not supplied'], ['Privacy consent','Yes'],
  ];
  const text = rows.map(([label,value]) => `${label}: ${value}`).join('\n');
  const html = `<h1>New event enquiry</h1><dl>${rows.map(([label,value]) => `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value).replace(/\n/g,'<br>')}</dd>`).join('')}</dl>`;

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json'},
      body:JSON.stringify({from, to:[to], reply_to:data.workEmail, subject:`Event enquiry · ${data.eventType} · ${data.city}`, text, html}),
      cache:'no-store',
    });
    if (!delivery.ok) return jsonError(502, 'DELIVERY_FAILED');
  } catch {
    return jsonError(502, 'DELIVERY_FAILED');
  }

  return NextResponse.json({ok:true}, {status:202, headers:{'Cache-Control':'no-store'}});
}
