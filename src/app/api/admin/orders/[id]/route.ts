import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH order error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE order error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}