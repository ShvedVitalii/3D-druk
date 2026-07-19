import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error('GET orders error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}