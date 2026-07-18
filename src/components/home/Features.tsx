'use client';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Features({ data }: { data?: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Дефолтні дані, якщо data відсутня
  const featuresData = data && data.length > 0 ? data : [
    {
      icon: '⚡',
      title: 'Швидкість',
      shortDesc: 'Друк від 1 дня',
      longDesc: 'Ми використовуємо сучасні принтери, що дозволяє друкувати вироби за лічені години. Термінові замовлення виконуємо за 24 години.',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: '🎯',
      title: 'Точність',
      shortDesc: 'Висота шару 0.1 мм',
      longDesc: 'Деталізація на рівні 0.1 мм забезпечує ідеальну якість поверхні та точність геометрії, що важливо для прототипів та дрібних деталей.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: '🧵',
      title: 'Матеріали',
      shortDesc: 'PLA, ABS, PETG, TPU',
      longDesc: 'Працюємо з різними пластиками: PLA для екологічних виробів, ABS для міцних деталей, PETG для хімічно стійких, TPU для гнучких.',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      icon: '💰',
      title: 'Доступно',
      shortDesc: 'Ціни від 4 грн/см³',
      longDesc: 'Ми пропонуємо конкурентні ціни на всі види друку. Для оптових замовлень діють знижки. Завжди розраховуємо індивідуально.',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: '📦',
      title: 'Доставка',
      shortDesc: 'Нова Пошта, Укрпошта',
      longDesc: 'Відправляємо по всій Україні Новою Поштою (1-3 дні) або Укрпоштою (2-5 днів). Також можливий самовивіз з нашого офісу у Стрию.',
      color: 'bg-rose-100 text-rose-700',
    },
    {
      icon: '🇺🇦',
      title: 'Допомога ЗСУ',
      shortDesc: 'Адаптери, кріплення',
      longDesc: 'На волонтерських засадах друкуємо адаптери, кріплення, тактичні аксесуари та інші деталі для потреб Збройних Сил України.',
      color: 'bg-indigo-100 text-indigo-700',
    },
  ];

  const toggleFeature = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-[#1a3c34] text-4xl md:text-5xl font-heading font-bold">
            Чому обирають нас?
          </h2>
          <p className="text-gray-600 text-lg">Натисніть на картку, щоб дізнатися більше</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuresData.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              <motion.div
                className={`bg-gray-50 p-6 rounded-2xl border border-gray-100 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                  activeIndex === idx ? 'ring-2 ring-[#c9a84c] shadow-lg' : ''
                }`}
                onClick={() => toggleFeature(idx)}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${f.color || 'bg-gray-200'} flex items-center justify-center text-3xl flex-shrink-0`}>
                    {f.icon || '📌'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{f.title}</h3>
                    <p className="text-base text-gray-500">{f.shortDesc}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#c9a84c] text-2xl"
                  >
                    ▼
                  </motion.div>
                </div>

                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-gray-600 border-t border-gray-200 pt-3 text-base">
                        {f.longDesc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}