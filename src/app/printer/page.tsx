'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';

export default function PrinterPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hoveredImage, setHoveredImage] = useState(false);

  // Основні характеристики
  const specs = [
    { label: 'Технологія', value: 'FDM (FFF)', icon: '🖨️', color: '#7ec8a3' },
    { label: 'Робоча область', value: '256×256×256 мм', icon: '📐', color: '#c9a84c' },
    { label: 'Точність друку', value: '±0.1 мм', icon: '🎯', color: '#4a9eff' },
    { label: 'Макс. швидкість', value: 'до 500 мм/с', icon: '⚡', color: '#ff6b6b' },
  ];

  // Детальні технічні характеристики
  const detailedSpecs = [
    { label: 'Технологія', value: 'FDM (Fused Deposition Modeling)' },
    { label: 'Робоча область', value: '256 × 256 × 256 мм' },
    { label: 'Точність друку', value: '±0.1 мм' },
    { label: 'Висота шару', value: '0.05 – 0.3 мм' },
    { label: 'Максимальна швидкість', value: 'до 500 мм/с' },
    { label: 'Прискорення', value: 'до 20 000 мм/с²' },
    { label: 'Діаметр нитки', value: '1.75 мм' },
    { label: 'Діаметр сопла', value: '0.4 мм (змінне)' },
    { label: 'Температура сопла', value: 'до 300°C' },
    { label: 'Температура стола', value: 'до 100°C' },
    { label: 'Матеріали', value: 'PLA, ABS, PETG, TPU, PC, PA, ASA' },
    { label: 'Екран', value: 'Кольоровий сенсорний 4.3"' },
    { label: 'Підключення', value: 'Wi-Fi, USB, Ethernet' },
    { label: 'Формати файлів', value: 'STL, OBJ, 3MF, G-code' },
    { label: 'Вага', value: '~8 кг' },
    { label: 'Габарити', value: '400 × 400 × 450 мм' },
  ];

  // Функції та можливості
  const features = [
    { 
      icon: '⚡', 
      title: 'Висока швидкість', 
      desc: 'Друкує зі швидкістю до 500 мм/с завдяки потужній системі приводу та оптимізованим алгоритмам.', 
      color: '#ff6b6b' 
    },
    { 
      icon: '🎯', 
      title: 'Висока точність', 
      desc: 'Точність ±0.1 мм та висота шару від 0.05 мм забезпечують ідеальну деталізацію навіть для найдрібніших моделей.', 
      color: '#4a9eff' 
    },
    { 
      icon: '🔄', 
      title: 'Автоматичне калібрування', 
      desc: 'Система автоматичного вирівнювання стола та калібрування сопла забезпечують ідеальний перший шар без ручного налаштування.', 
      color: '#7ec8a3' 
    },
    { 
      icon: '🔇', 
      title: 'Безшумна робота', 
      desc: 'Спеціальні драйвери крокових двигунів та звукоізоляція роблять друк майже безшумним – ідеально для дому та офісу.', 
      color: '#c9a84c' 
    },
    { 
      icon: '📱', 
      title: 'Керування через Wi-Fi', 
      desc: 'Відстежуйте друк та керуйте принтером через додаток на смартфоні з будь-якої точки світу.', 
      color: '#4a9eff' 
    },
    { 
      icon: '🔋', 
      title: 'Відновлення після вимкнення', 
      desc: 'У разі відключення живлення принтер запам\'ятовує позицію та продовжує друк з місця зупинки.', 
      color: '#ff6b6b' 
    },
    { 
      icon: '🧵', 
      title: 'Сенсор нитки', 
      desc: 'Автоматичне виявлення закінчення або обриву нитки – друк зупиняється, ви чекаєте заміну та продовжуєте.', 
      color: '#c9a84c' 
    },
    { 
      icon: '🌡️', 
      title: 'Контроль температури', 
      desc: 'Підігрів стола до 100°C та сопла до 300°C дозволяють працювати з широким спектром матеріалів, включаючи інженерні пластики.', 
      color: '#7ec8a3' 
    },
  ];

  return (
    <div ref={ref} className="pt-32 pb-20 container-custom max-w-6xl mx-auto overflow-hidden">
      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-block px-4 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-semibold mb-3"
        >
          🖨️ Наше обладнання
        </motion.span>
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">
          Bambu Lab A1
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Сучасний 3D-принтер для професійного та домашнього використання
        </p>
      </motion.div>

      {/* Герой секція з принтером */}
      <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring', damping: 20 }}
          className="relative"
          onMouseEnter={() => setHoveredImage(true)}
          onMouseLeave={() => setHoveredImage(false)}
        >
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-[#1a3c34]/10 border-2 border-gray-200/50 group">
            <Image
              src="/images/printer/main.jpg"
              alt="Bambu Lab A1 3D принтер"
              fill
              className={`object-cover transition-transform duration-700 ${
                hoveredImage ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3c34]/20 via-transparent to-transparent" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200"
            >
              <span className="text-sm font-bold text-[#1a3c34]">⚡ до 500 мм/с</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200"
            >
              <span className="text-sm font-bold text-[#1a3c34]">🎯 ±0.1 мм</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-[#1a3c34]">Bambu Lab A1</h2>
          <p className="text-gray-500 leading-relaxed">
            Потужний та надійний 3D-принтер для професійного друку. Ідеальний для 
            створення прототипів, іграшок, функціональних деталей та багато іншого. 
            Забезпечує високу швидкість друку до 500 мм/с, чудову якість та простоту 
            у використанні завдяки автоматичному калібруванню та інтелектуальним функціям.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {specs.map((spec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + idx * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center transition-all"
                style={{ borderBottom: `3px solid ${spec.color}` }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  className="text-2xl block mb-1"
                >
                  {spec.icon}
                </motion.span>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{spec.label}</p>
                <p className="font-bold text-[#1a3c34] text-sm">{spec.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button href="/order" variant="primary">Замовити друк</Button>
            <Button href="/gallery" variant="secondary">Подивитись роботи</Button>
          </div>
        </motion.div>
      </div>

      {/* Повні технічні характеристики */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-20"
      >
        <h3 className="text-2xl font-bold text-[#1a3c34] mb-6 text-center">
          📊 Повні технічні характеристики
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {detailedSpecs.map((spec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + idx * 0.04 }}
              whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
              className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <span className="text-sm text-gray-500 font-medium">{spec.label}</span>
              <span className="text-sm font-semibold text-[#1a3c34] text-right ml-4">{spec.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Переваги принтера */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-center text-2xl font-bold text-[#1a3c34] mb-4">
          Чому Bambu Lab A1 найкращий вибір?
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10 max-w-2xl mx-auto">
          Поєднання швидкості, точності та надійності робить цей принтер ідеальним для будь-яких завдань
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + idx * 0.08 }}
              whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center transition-all cursor-pointer group"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.3 }}
                className="text-4xl block mb-3"
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-bold text-[#1a3c34] text-lg" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Кнопка замовлення внизу */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-gray-500 text-sm mb-4">Готові замовити друк на цьому принтері?</p>
        <Button href="/order" variant="primary" className="text-lg px-10 py-4">
          Перейти до замовлення
        </Button>
      </motion.div>
    </div>
  );
}