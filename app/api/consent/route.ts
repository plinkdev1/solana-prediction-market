import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, accepted, wallet } = body;

    const validTypes = ['cookie', 'age_gate', 'tos', 'market_create', 'data_export'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid consent type' }, { status: 400 });
    }

    if (typeof accepted !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid accepted value' }, { status: 400 });
    }

    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0] || null;
    const ipHash = hashIp(rawIp);

    const { error } = await supabase.from('consent_log').insert({
      user_wallet: wallet || null,
      ip_hash: ipHash,
      consent_type: type,
      accepted,
    });

    if (error) {
      console.error('[v0] Consent insert error:', error.message);
      return NextResponse.json({ success: false, error: 'Failed to log consent' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Consent API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
