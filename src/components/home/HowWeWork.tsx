'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  { id: 1, title: 'Заявка', desc: 'Ви заповнюєте форму з описом і завантажуєте файл моделі.' },
  { id: 2, title: 'Розрахунок', desc: 'Ми оцінюємо вартість і терміни, зв’язуємося з вами.' },
  { id: 3, title: 'Друк', desc: 'Запускаємо друк з контролем якості на кожному етапі.' },
  { id: 4, title: 'Готово', desc: 'Ви отримуєте готовий виріб або доставку по Україні.' },
];

export default function HowWeWork() {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-[#1a3c34]">Як ми працюємо</h2>
          <p className="text-[#5a5a5a] text-lg">Натисніть на крок, щоб дізнатися деталі</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActive(active === step.id ? null : step.id)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${
                active === step.id
                  ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#1a3c34] shadow-lg shadow-[#c9a84c]/20'
                  : 'border-[#d0d0d0] text-[#5a5a5a] hover:border-[#1a3c34] hover:text-[#1a3c34]'
              }`}
            >
              {step.id}. {step.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto bg-[#f5f0eb] p-8 rounded-3xl shadow-lg"
            >
              <h3 className="text-2xl font-serif font-bold text-[#1a3c34] mb-2">
                {steps.find(s => s.id === active)?.title}
              </h3>
              <p className="text-[#3d3d3d] text-lg">
                {steps.find(s => s.id === active)?.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}