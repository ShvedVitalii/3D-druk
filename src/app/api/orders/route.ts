import { supabaseAdmin } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ВИКОРИСТОВУЄМО onboarding@resend.dev, якщо не задано інше
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '3ddrukstriy@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, delivery, items, total, source, payment } = body;

    if (!customer || !delivery || !items || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Збереження в Supabase
    const { data, error } = await supabaseAdmin.from('orders').insert([
      {
        customer,
        delivery,
        items,
        total,
        source: source || 'form',
        status: 'pending',
        payment: payment || null,
      },
    ]).select();

    if (error) {
      console.error('❌ Помилка збереження замовлення:', error);
      return NextResponse.json(
        { error: 'Помилка бази даних: ' + error.message },
        { status: 500 }
      );
    }

    revalidatePath('/admin/orders');

    const orderId = data?.[0]?.id || `ORDER-${Date.now()}`;

    // ===== ВІДПРАВКА EMAIL =====
    let emailSent = false;
    let emailError = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const itemList = items.map((item: any) => 
          `- ${item.title} (${item.quantity || 1} шт.) × ${item.price} ₴` +
          (item.options ? ` (${Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')})` : '')
        ).join('\n');

        const adminText = `
🆕 НОВЕ ЗАМОВЛЕННЯ #${orderId}

Клієнт: ${customer.name}
Телефон: ${customer.phone}
Email: ${customer.email || 'не вказано'}
Коментар: ${customer.comment || 'немає'}

Доставка: ${delivery.type === 'nova' ? 'Нова Пошта' : delivery.type === 'ukr' ? 'Укрпошта' : 'Самовивіз'}
Місто: ${delivery.city || 'не вказано'}
Відділення: ${delivery.warehouse || 'не вказано'}

Товари:
${itemList}

Загальна сума: ${total} ₴

Джерело: ${source === 'cart' ? '🛒 Кошик' : '📝 Форма'}

${payment?.confirmed ? '✅ Оплата підтверджена' : '❌ Оплата НЕ підтверджена'}
${payment?.number ? `Номер платежу: ${payment.number}` : ''}

---
Переглянути: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders
        `;

        // Відправка адміну
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `🆕 Нове замовлення #${orderId}`,
          text: adminText,
        });

        emailSent = true;
        console.log(`✅ Email про замовлення #${orderId} надіслано на ${ADMIN_EMAIL}`);

        // Якщо є email клієнта – надсилаємо йому підтвердження
        if (customer.email) {
          const clientText = `
Дякуємо за ваше замовлення #${orderId}!

Ми отримали ваше замовлення і незабаром зв'яжемося з вами.

Деталі:
${itemList}

Загальна сума: ${total} ₴

Доставка: ${delivery.type === 'nova' ? 'Нова Пошта' : delivery.type === 'ukr' ? 'Укрпошта' : 'Самовивіз'}

З повагою,
Команда 3D-друк
          `;

          await resend.emails.send({
            from: FROM_EMAIL,
            to: [customer.email],
            subject: `✅ Ваше замовлення #${orderId} прийнято`,
            text: clientText,
          });
        }

      } catch (emailErr: any) {
        console.error('❌ Помилка відправки email:', emailErr);
        emailError = emailErr.message || 'Невідома помилка';
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY не налаштовано');
    }

    // Повертаємо успіх, навіть якщо email не надіслано (замовлення збережено)
    return NextResponse.json({
      success: true,
      id: orderId,
      emailSent,
      emailError: emailError || null,
    });

  } catch (e: any) {
    console.error('❌ Помилка API:', e);
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера: ' + e.message },
      { status: 500 }
    );
  }
}