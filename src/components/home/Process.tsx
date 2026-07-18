'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Process({ data }: { data?: any[] }) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Дефолтні дані
  const stepsData = data && data.length > 0 ? data : [
    {
      id: 1,
      title: 'Заявка',
      icon: '📄',
      description: 'Ви заповнюєте форму з описом і завантажуєте 3D-модель (STL, OBJ, 3MF). Ми отримуємо всі дані та починаємо аналіз.',
      detail: 'Можна додати коментарі, вказати бажані матеріали, кольори та терміни.',
    },
    {
      id: 2,
      title: 'Розрахунок',
      icon: '📊',
      description: 'Ми оцінюємо вартість, терміни та погоджуємо всі деталі. Ви отримуєте точну ціну та дату готовності.',
      detail: 'Якщо потрібно, ми допомагаємо оптимізувати модель для економії матеріалу.',
    },
    {
      id: 3,
      title: 'Друк',
      icon: '🖨️',
      description: 'Запускаємо друк з контролем якості на кожному етапі. Ми стежимо за процесом 24/7.',
      detail: 'Ви можете отримувати фото-звіти про хід друку в Telegram.',
    },
    {
      id: 4,
      title: 'Готово',
      icon: '📦',
      description: 'Ви отримуєте готовий виріб або доставку по Україні. Ми перевіряємо якість перед відправкою.',
      detail: 'Доставляємо Новою Поштою, Укрпоштою або самовивіз з нашого офісу.',
    },
  ];

  const handleStepClick = (id: number) => {
    setActive(active === id ? null : id);
  };

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#2e7d32] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#4caf50] rounded-full blur-3xl" />
      </div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-[#1a3c34] text-4xl md:text-5xl font-heading font-bold">Як ми працюємо</h2>
          <p className="text-gray-600 text-lg">
            Оберіть крок, щоб дізнатися деталі
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 hidden md:block transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 relative z-10">
            {stepsData.map((step, idx) => {
              const isActive = active === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 w-full ${
                      isActive ? 'scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-200 ${
                        isActive
                          ? 'bg-[#2e7d32] text-white shadow-xl shadow-[#2e7d32]/30'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`text-lg font-bold transition-colors duration-200 ${
                        isActive ? 'text-[#2e7d32]' : 'text-gray-400'
                      }`}
                    >
                      {step.id}. {step.title}
                    </span>
                    <div
                      className={`w-full h-1 rounded-full transition-all duration-200 ${
                        isActive ? 'bg-[#2e7d32]' : 'bg-transparent'
                      }`}
                    />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.97 }}
                transition={{ duration: 0.25, type: 'spring', damping: 25, stiffness: 300 }}
                className="mt-8 p-8 bg-gray-50 rounded-3xl shadow-lg border border-gray-200 max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#2e7d32] flex items-center justify-center text-white text-3xl flex-shrink-0">
                    {stepsData.find(s => s.id === active)?.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[#1a3c34]">
                      {stepsData.find(s => s.id === active)?.title}
                    </h3>
                    <p className="text-gray-600 text-lg mt-2">
                      {stepsData.find(s => s.id === active)?.description}
                    </p>
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-500">
                        💡 {stepsData.find(s => s.id === active)?.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}