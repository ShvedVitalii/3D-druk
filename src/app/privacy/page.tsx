'use client';

import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const [contacts, setContacts] = useState<any>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const contactsItem = items.find((item: any) => item.key === 'contacts');
        if (contactsItem?.data) {
          setContacts(contactsItem.data);
        } else {
          // Дефолтні контакти, якщо в базі немає
          setContacts({
            phone: '+38 098 0751707',
            email: 'komarnytskiy.yura@gmail.com',
            address: '82400, м. Стрий, вул. Народна, 8',
          });
        }
      } catch (err) {
        console.error('Помилка завантаження контактів:', err);
        setContacts({
          phone: '+38 098 0751707',
          email: 'komarnytskiy.yura@gmail.com',
          address: '82400, м. Стрий, вул. Народна, 8',
        });
      }
    }
    fetchContacts();
  }, []);

  return (
    <div className="pt-32 pb-20 container-custom max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-[#1a3c34] mb-6">Політика конфіденційності</h1>
      <div className="prose prose-lg text-gray-600 space-y-4">
        <p><strong>Останнє оновлення:</strong> 1 липня 2026 року</p>

        <p>Ми, компанія «3D-друк», поважаємо ваше право на приватність і зобов'язуємося захищати ваші персональні дані. Ця Політика конфіденційності пояснює, яку інформацію ми збираємо, як ми її використовуємо та захищаємо.</p>

        <h2 className="text-2xl font-heading font-semibold text-[#1a3c34] mt-6">1. Яку інформацію ми збираємо</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ім'я, телефон, email – для обробки замовлень та зв'язку з вами.</li>
          <li>Файли моделей (STL, OBJ, 3MF) – для виконання друку.</li>
          <li>Дані про доставку (місто, відділення) – для відправки готових виробів.</li>
          <li>Інформацію про використання сайту (cookie, аналітика) – для покращення роботи сервісу.</li>
        </ul>

        <h2 className="text-2xl font-heading font-semibold text-[#1a3c34] mt-6">2. Як ми використовуємо ваші дані</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Для обробки та виконання ваших замовлень.</li>
          <li>Для спілкування з вами щодо статусу замовлення.</li>
          <li>Для покращення наших послуг та контенту сайту.</li>
          <li>Ми не передаємо ваші дані третім особам без вашої згоди, крім випадків, передбачених законодавством.</li>
        </ul>

        <h2 className="text-2xl font-heading font-semibold text-[#1a3c34] mt-6">3. Захист даних</h2>
        <p>Ми використовуємо сучасні методи шифрування та захисту даних, щоб запобігти несанкціонованому доступу, зміні або розголошенню вашої інформації. Усі дані зберігаються на захищених серверах.</p>

        <h2 className="text-2xl font-heading font-semibold text-[#1a3c34] mt-6">4. Ваші права</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ви можете переглядати, редагувати або видалити свої персональні дані, зв'язавшись з нами.</li>
          <li>Ви можете відмовитися від отримання маркетингових повідомлень у будь-який час.</li>
          <li>Ви маєте право на портативність даних – отримати копію всієї інформації, яку ми зберігаємо про вас.</li>
        </ul>

        <h2 className="text-2xl font-heading font-semibold text-[#1a3c34] mt-6">5. Контакти</h2>
        <p>
          Якщо у вас є запитання щодо цієї Політики конфіденційності, зв'яжіться з нами за електронною адресою:{' '}
          <a href={`mailto:${contacts?.email || 'komarnytskiy.yura@gmail.com'}`} className="text-[#c9a84c] hover:underline">
            {contacts?.email || 'komarnytskiy.yura@gmail.com'}
          </a>
          {' '}або за телефоном{' '}
          <a href={`tel:${contacts?.phone?.replace(/\s/g, '') || '+380980751707'}`} className="text-[#c9a84c] hover:underline">
            {contacts?.phone || '+38 098 0751707'}
          </a>
          .
        </p>
        {contacts?.address && (
          <p>Наша адреса: {contacts.address}</p>
        )}
      </div>
    </div>
  );
}