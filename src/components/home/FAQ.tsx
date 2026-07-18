'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FAQ({ data }: { data?: any[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Дефолтні дані
  const faqData = data && data.length > 0 ? data : [
    { q: 'Які матеріали ви використовуєте?', a: 'Працюємо з PLA, ABS, PETG, TPU. Можемо підібрати оптимальний матеріал для вашого завдання.' },
    { q: 'Яка мінімальна товщина шару?', a: '0.1 мм — забезпечує високу деталізацію, ідеально для фігурок та складних прототипів.' },
    { q: 'Скільки часу займає друк?', a: 'Від 1 години до кількох днів. Ми завжди узгоджуємо терміни до початку роботи.' },
    { q: 'Чи можете ви надрукувати великі деталі?', a: 'Так, максимальний розмір — 220×220×250 мм. Більші вироби можна надрукувати частинами та склеїти.' },
    { q: 'Як замовити друк?', a: 'Заповніть форму на сторінці "Замовити друк" або скористайтеся AI-консультантом.' },
  ];

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="container-custom max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 text-[#1a3c34]"
        >
          Часті запитання
        </motion.h2>
        <div className="space-y-3">
          {faqData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#f5f0eb] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <button
                className="w-full text-left p-5 font-semibold flex justify-between items-center hover:bg-[#e8e0d8] transition"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-[#1a3c34]">{item.q}</span>
                <span className={`text-2xl text-[#c9a84c] transition-transform duration-300 ${open === idx ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence>
                {open === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-[#3d3d3d] border-t border-[#d0c8c0]">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}