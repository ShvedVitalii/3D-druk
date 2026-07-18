import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('content').select('*');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { key, data } = await req.json();
    if (!key || data === undefined) {
      return NextResponse.json({ error: 'key and data are required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('content')
      .upsert({ key, data, updated_at: new Date().toISOString() });

    if (error) throw error;
    
    // Оновлюємо кеш головної сторінки та адмінки
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('content').delete().eq('key', key);
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin');
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}