'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch contacts');
        const items = await res.json();
        const contactsItem = items.find((item: any) => item.key === 'contacts');
        setContacts(contactsItem?.data || null);
      } catch (err) {
        console.error('Помилка завантаження контактів у футері:', err);
        setContacts(null);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const c = contacts || {
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, м. Стрий, вул. Народна, 8',
    workHours: 'Пн–Пт 9:00–18:00',
    socialLinks: [
      { name: 'Telegram', url: 'https://t.me/3d_print', icon: 'Telegram' },
      { name: 'WhatsApp', url: 'https://wa.me/380980751707', icon: 'WhatsApp' },
      { name: 'Instagram', url: 'https://instagram.com/3d_print_ua', icon: 'Instagram' },
    ],
  };

  let socialLinks = c.socialLinks;
  if (!socialLinks || !Array.isArray(socialLinks) || socialLinks.length === 0) {
    socialLinks = [];
    if (c.telegram) socialLinks.push({ name: 'Telegram', url: c.telegram, icon: 'Telegram' });
    if (c.whatsapp) socialLinks.push({ name: 'WhatsApp', url: c.whatsapp, icon: 'WhatsApp' });
    if (c.instagram) socialLinks.push({ name: 'Instagram', url: c.instagram, icon: 'Instagram' });
  }

  return (
    <footer className="bg-[#1a3c34] border-t border-[#c9a84c]/20 py-16 text-white">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="text-2xl font-serif font-bold text-[#c9a84c] hover:text-[#b89a3e] transition">
            3D-друк
          </Link>
          <p className="text-gray-300 text-sm leading-relaxed mt-2">
            Якісний 3D-друк на замовлення. Іграшки, прототипи, допомога ЗСУ.
          </p>
          <p className="text-gray-400 text-xs mt-4">© 2026 — Всі права захищені.</p>
        </div>

        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Навігація</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-gray-300 hover:text-[#7ec8a3] transition">Головна</Link></li>
            <li><Link href="/services" className="text-gray-300 hover:text-[#7ec8a3] transition">Послуги</Link></li>
            <li><Link href="/printer" className="text-gray-300 hover:text-[#7ec8a3] transition">Принтери</Link></li>
            <li><Link href="/gallery" className="text-gray-300 hover:text-[#7ec8a3] transition">Каталог</Link></li>
            <li><Link href="/contacts" className="text-gray-300 hover:text-[#7ec8a3] transition">Контакти</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Корисне</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/order" className="text-gray-300 hover:text-[#7ec8a3] transition">Замовити друк</Link></li>
            <li><Link href="/privacy" className="text-gray-300 hover:text-[#7ec8a3] transition">Політика конфіденційності</Link></li>
            <li><Link href="/terms" className="text-gray-300 hover:text-[#7ec8a3] transition">Умови використання</Link></li>
            <li><Link href="/#pricing" className="text-gray-300 hover:text-[#7ec8a3] transition">Доставка та оплата</Link></li>
            <li><Link href="/about-3d" className="text-gray-300 hover:text-[#7ec8a3] transition">Все про 3D-друк</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#c9a84c] mb-3">Контакти</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{c.phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${c.email}`} className="flex items-center gap-3 hover:text-[#7ec8a3] transition group">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{c.email}</span>
              </a>
            </li>
            <li>
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{c.workHours || 'Пн–Пт 9:00–18:00'}</span>
              </span>
            </li>
            <li>
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{c.address}</span>
              </span>
            </li>
          </ul>

          {socialLinks.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-[#c9a84c]/20 pt-4">
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
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-[#7ec8a3] transition group"
                  >
                    <img
                      src={localSrc}
                      alt={link.name}
                      className="w-5 h-5 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition"
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
                            span.className = 'text-xl';
                            span.textContent = '🔗';
                            parent.appendChild(span);
                          }
                        }
                      }}
                    />
                    <span className="font-medium">{link.name}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}