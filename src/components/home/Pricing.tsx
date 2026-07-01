'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import CalculatorModal from '@/components/order/CalculatorModal';

const pricingData = [
  {
    title: 'Орієнтовні ціни',
    icon: '💰',
    items: [
      { label: 'PLA', value: 'від 4 грн/см³' },
      { label: 'ABS', value: 'від 5 грн/см³' },
      { label: 'PETG', value: 'від 6 грн/см³' },
      { label: 'TPU', value: 'від 7 грн/см³' },
    ],
    footer: '*Точна ціна після узгодження моделі',
    action: 'Розрахувати вартість',
  },
  {
    title: 'Доставка',
    icon: '🚚',
    items: [
      { label: 'Нова Пошта', value: '1-3 дні' },
      { label: 'Укрпошта', value: '2-5 днів' },
      { label: 'Самовивіз', value: 'Львів' },
    ],
    footer: 'Вартість згідно з тарифами перевізника',
    action: null,
  },
  {
    title: 'Гарантії',
    icon: '✅',
    items: [
      { label: 'Якість', value: 'Перевірка кожного виробу' },
      { label: 'Заміна', value: 'Безкоштовно при браку' },
      { label: 'Консультація', value: 'Перед друком' },
    ],
    footer: 'Ми дорожимо своєю репутацією',
    action: null,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [calcOpen, setCalcOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <>
      <section ref={ref} id="pricing" className="py-20 bg-[#1a3c34] text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7ec8a3]/30 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#c9a84c]/10 to-transparent animate-float" />
        </div>

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-white">Вартість та доставка</h2>
            <p className="text-[#7ec8a3] text-lg">Прозорі ціни та зручна логістика</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingData.map((block, idx) => {
              const isActive = activeCard === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  onMouseEnter={() => setActiveCard(idx)}
                  onMouseLeave={() => setActiveCard(null)}
                  className={`bg-white/10 backdrop-blur-sm p-6 rounded-2xl border transition-all duration-300 ${
                    isActive ? 'border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20 scale-[1.02]' : 'border-white/20 hover:border-[#c9a84c]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.span
                      className="text-3xl"
                      animate={{ scale: isActive ? 1.2 : 1, rotate: isActive ? 10 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {block.icon}
                    </motion.span>
                    <h3 className="text-xl font-bold text-[#c9a84c]">{block.title}</h3>
                  </div>

                  <ul className="space-y-2 text-gray-200">
                    {block.items.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: idx * 0.1 + i * 0.05 }}
                        className="flex justify-between items-center py-1 border-b border-white/10 last:border-0"
                      >
                        <span>{item.label}</span>
                        <motion.span
                          className="text-[#7ec8a3] font-medium"
                          animate={{ scale: isActive ? 1.05 : 1 }}
                        >
                          {item.value}
                        </motion.span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.p
                    className="text-sm text-gray-300 mt-4"
                    animate={{ opacity: isActive ? 1 : 0.7 }}
                  >
                    {block.footer}
                  </motion.p>

                  {block.action && (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => setCalcOpen(true)} variant="primary" className="mt-4 w-full">
                        {block.action}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />
    </>
  );
}