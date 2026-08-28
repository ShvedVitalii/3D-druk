'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Дефолтні значення – використовуються, якщо дані з API відсутні
const DEFAULT_CONTACTS = {
  phone: '+38 098 0751707',
  email: '3ddrukstriy@gmail.com',
  address: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
  workHours: 'Пн–Пт 9:00–18:00',
  socialLinks: [
    { name: 'Telegram', url: 'https://t.me/3d_print', icon: 'Telegram' },
    { name: 'WhatsApp', url: 'https://wa.me/380980751707', icon: 'WhatsApp' },
    { name: 'Instagram', url: 'https://instagram.com/3d_print_ua', icon: 'Instagram' },
  ],
};

export default function Contact({ data }: { data?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [contacts, setContacts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Якщо дані передані з батьківського компонента (з page.tsx) – використовуємо їх
    if (data) {
      setContacts(data);
      setLoading(false);
      return;
    }

    // Інакше – завантажуємо з API
    async function fetchContacts() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const contactsItem = items.find((item: any) => item.key === 'contacts');
        if (contactsItem?.data) {
          setContacts(contactsItem.data);
        } else {
          setContacts(DEFAULT_CONTACTS);
        }
      } catch (err) {
        console.error('Помилка завантаження контактів:', err);
        setContacts(DEFAULT_CONTACTS);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [data]);

  // Поки дані завантажуються – показуємо блок з дефолтними значеннями (щоб не зникав)
  const contactData = contacts || DEFAULT_CONTACTS;

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container-custom grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1a3c34]">Наші контакти</h2>
          <p className="text-[#5a5a5a] text-lg mb-6">Завжди на зв'язку</p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="hover:text-[#c9a84c] transition">
                {contactData.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${contactData.email}`} className="hover:text-[#c9a84c] transition">
                {contactData.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{contactData.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{contactData.workHours || 'Пн–Пт 9:00–18:00'}</span>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            {contactData.socialLinks && contactData.socialLinks.map((link: any, idx: number) => {
              const iconName = link.icon || link.name;
              const localSrc = `/images/icons/${iconName}.svg`;
              const cdnFallback = `https://cdn.simpleicons.org/${iconName.toLowerCase()}`;
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 hover:border-[#c9a84c] hover:bg-[#f5f0eb] transition-all"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-64"
        >
          <iframe
            src="https://www.google.com/maps?q=82400+Львівська+обл.+Стрий+вул.+Народна+8&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Карта Google Maps"
          />
        </motion.div>
      </div>
    </section>
  );
}