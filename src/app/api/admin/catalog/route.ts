import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// GET: отримати весь каталог
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('content')
      .select('data')
      .eq('key', 'catalog')
      .single();

    if (error) throw error;
    return NextResponse.json(data?.data || { categories: [], products: [] });
  } catch (e) {
    console.error('GET catalog error:', e);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}

// PUT: оновити весь каталог (або окремі частини)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { categories, products } = body;

    // Отримуємо поточний каталог
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from('content')
      .select('data')
      .eq('key', 'catalog')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    const existing = existingData?.data || { categories: [], products: [] };

    // Переконуємося, що всі категорії та товари мають поле order
    const processedCategories = (categories ?? existing.categories).map((c: any) => ({
      ...c,
      order: c.order !== undefined ? c.order : 0,
    }));

    const processedProducts = (products ?? existing.products).map((p: any) => ({
      ...p,
      order: p.order !== undefined ? p.order : 0,
    }));

    const newData = {
      categories: processedCategories,
      products: processedProducts,
    };

    const { error } = await supabaseAdmin
      .from('content')
      .upsert({ key: 'catalog', data: newData, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/category');
    revalidatePath('/product');
    revalidatePath('/admin/catalog');

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PUT catalog error:', e);
    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 500 });
  }
}