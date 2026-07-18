'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '@/components/ui/Button';

export default function Contact({ data }: { data?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Дефолтні дані
  const contactData = data || {
    phone: '+38 098 0751707',
    email: 'komarnytskiy.yura@gmail.com',
    address: '82400, Львівська обл., м. Стрий, вул. Народна, 8',
    telegram: 'https://t.me/3d_print',
    whatsapp: 'https://wa.me/380980751707',
    instagram: 'https://instagram.com/3d_print_ua',
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container-custom grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
        >
          <h2 className="text-[#1a3c34]">Наші контакти</h2>
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
              <span>Пн–Пт 9:00–18:00</span>
            </li>
          </ul>
          <div className="mt-8 flex gap-4">
            <Button href={contactData.telegram || 'https://t.me/3d_print'} variant="primary">Telegram</Button>
            <Button href={contactData.whatsapp || 'https://wa.me/380980751707'} variant="secondary" className="border-[#1a3c34] text-[#1a3c34] hover:bg-[#1a3c34]/10">
              WhatsApp
            </Button>
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