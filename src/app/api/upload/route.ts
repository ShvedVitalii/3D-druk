import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не знайдено' }, { status: 400 });
    }

    // Перевірка розміру (50 МБ)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Файл занадто великий. Максимальний розмір: ${Math.round(maxSize / (1024 * 1024))} МБ` },
        { status: 400 }
      );
    }

    // Генеруємо унікальне ім'я файлу
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}.${ext}`;
    const filePath = `services/${fileName}`;

    // Конвертуємо File в Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Завантажуємо в Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('service-files')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Помилка завантаження в Storage:', error);
      return NextResponse.json(
        { error: `Помилка завантаження файлу: ${error.message}` },
        { status: 500 }
      );
    }

    // Отримуємо публічний URL
    const { data: urlData } = supabaseAdmin.storage
      .from('service-files')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: fileName,
      originalName: file.name,
    });
  } catch (e) {
    console.error('Помилка:', e);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 }
    );
  }
}