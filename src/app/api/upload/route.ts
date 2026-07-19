import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 });
    }

    // Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `uploads/${fileName}`;

    // Конвертуємо File в Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Завантажуємо в Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('uploads') // назва вашого bucket
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Помилка завантаження в Storage:', error);
      return NextResponse.json({ error: 'Помилка завантаження файлу' }, { status: 500 });
    }

    // Отримуємо публічний URL
    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: fileName,
    });
  } catch (e) {
    console.error('Помилка:', e);
    return NextResponse.json({ error: 'Внутрішня помилка' }, { status: 500 });
  }
}