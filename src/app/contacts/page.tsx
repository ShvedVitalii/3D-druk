'use client';

import { useEffect, useState } from 'react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const contactsItem = items.find((item: any) => item.key === 'contacts');
        if (contactsItem?.data) {
          const d = contactsItem.data;
          if (!d.socialLinks) {
            const socialLinks = [];
            if (d.telegram) socialLinks.push({ name: 'Telegram', url: d.telegram, icon: 'Telegram' });
            if (d.whatsapp) socialLinks.push({ name: 'WhatsApp', url: d.whatsapp, icon: 'WhatsApp' });
            if (d.instagram) socialLinks.push({ name: 'Instagram', url: d.instagram, icon: 'Instagram' });
            d.socialLinks = socialLinks;
          }
          d.socialLinks = d.socialLinks.map((link: any) => ({
            ...link,
            icon: link.icon || link.name,
          }));
          setContacts(d);
        } else {
          setContacts({
            phone: '+380 98 075 17 07',
            email: 'komarnytskiy.yura@gmail.com',
            address: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
            workHours: 'Пн–Пт 9:00–18:00',
            socialLinks: [
              { name: 'Telegram', url: 'https://t.me/3d_print', icon: 'Telegram' },
              { name: 'WhatsApp', url: 'https://wa.me/380980751707', icon: 'WhatsApp' },
              { name: 'Instagram', url: 'https://instagram.com/3d_print_ua', icon: 'Instagram' },
            ],
          });
        }
      } catch (err) {
        console.error('Помилка завантаження контактів:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  if (loading) return <div className="pt-32 pb-20 container-custom text-center">Завантаження...</div>;
  if (!contacts) return <div className="pt-32 pb-20 container-custom text-center">Контакти не знайдено</div>;

  const socialLinks = contacts.socialLinks || [];

  const items = [
    { icon: '📞', label: 'Телефон', value: contacts.phone, href: `tel:${contacts.phone.replace(/\s/g, '')}` },
    { icon: '✉️', label: 'Email', value: contacts.email, href: `mailto:${contacts.email}` },
    { icon: '🕒', label: 'Графік роботи', value: contacts.workHours || 'Пн–Пт 9:00–18:00', href: null },
    { icon: '📍', label: 'Адреса', value: contacts.address, href: null },
  ];

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">Контакти</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Зв'яжіться з нами – ми завжди на зв'язку
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 flex items-center gap-4 hover:shadow-md hover:border-[#c9a84c]"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-gray-700 font-medium hover:text-[#1a3c34] transition break-words block">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-700 font-medium break-words">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Соціальні мережі з SVG логотипами */}
        {socialLinks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-[#1a3c34] mb-4">Ми в соцмережах</h2>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link: any, idx: number) => {
                const iconName = link.icon || link.name;
                const localSrc = `/images/icons/${iconName}.svg`;
                const cdnFallback = `https://cdn.simpleicons.org/${iconName.toLowerCase()}`;
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 hover:border-[#c9a84c] hover:bg-[#f5f0eb] transition-all duration-200"
                  >
                    <img
                      src={localSrc}
                      alt={link.name}
                      className="w-5 h-5"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = 'true';
                          img.src = cdnFallback;
                        } else {
                          img.style.display = 'none';
                          const parent = img.parentNode;
                          if (parent) {
                            const span = document.createElement('span');
                            span.className = 'text-lg';
                            span.textContent = '🔗';
                            parent.prepend(span);
                          }
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
          <div className="relative w-full h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps?q=82400+Львівська+обл.+Стрий+вул.+Народна+8&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title="Карта Google Maps"
            />
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📍</span>
              <span>{contacts.address}</span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contacts.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c9a84c] font-medium text-sm hover:underline flex items-center gap-1"
            >
              Прокласти маршрут
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}