import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, delivery, items, total, source } = body;

    // Валідація
    if (!customer || !delivery || !items || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from('orders').insert([
      {
        customer,
        delivery,
        items,
        total,
        source: source || 'form',
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('❌ Помилка збереження замовлення:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Оновлюємо кеш для сторінки заявок
    revalidatePath('/admin/orders');

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('❌ Помилка API:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}