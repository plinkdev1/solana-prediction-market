import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createSupabaseClient();
    
    const { data: treasury, error } = await supabase
      .from('treasury')
      .select('*')
      .single();

    if (error) {
      console.error('[v0] Treasury fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(treasury);
  } catch (error) {
    console.error('[v0] Treasury route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
