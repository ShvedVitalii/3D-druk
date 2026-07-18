'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import CalculatorModal from '@/components/order/CalculatorModal';

// =========================
// 1. Великі плаваючі фігури
// =========================
const FloatingShapes = () => {
  const [shapes, setShapes] = useState<
    { size: number; x: number; y: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const newShapes = Array.from({ length: 6 }, () => ({
      size: 40 + Math.random() * 80,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setShapes(newShapes);
  }, []);

  if (shapes.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#7ec8a3]/10"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: `radial-gradient(circle, rgba(126,200,163,0.05) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// =========================
// 2. Дрібні крапки
// =========================
const TinyDots = () => {
  const [dots, setDots] = useState<
    { x: number; y: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const newDots = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 3,
    }));
    setDots(newDots);
  }, []);

  if (dots.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 1, 0.3],
            y: [0, -20, 0],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// =========================
// 3. Друкарський текст
// =========================
const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span className={className}>
      {displayText}
      {index < text.length && (
        <span className="inline-block w-1 h-8 bg-[#7ec8a3] ml-1 animate-pulse" />
      )}
    </span>
  );
};

// =========================
// 4. Дані для модалки "Супер взірці нового покоління"
// =========================
const newGenItems = [
  // Протези (складні функціональні вироби)
  {
    src: '/images/gallery/7.jpg',
    title: 'Біонічний протез руки',
    category: 'Протези',
    tags: ['AMS-друк', 'TPU', 'Точність 0.05 мм'],
    description: 'Функціональний протез з адаптивним захватом, надрукований за індивідуальними параметрами.',
  },
  {
    src: '/images/gallery/9.jpg',
    title: 'Протез кисті',
    category: 'Протези',
    tags: ['PETG', 'Висока міцність'],
    description: 'Легка конструкція з посиленими вузлами для щоденного використання.',
  },
  {
    src: '/images/gallery/10.jpg',
    title: 'Протез передпліччя',
    category: 'Протези',
    tags: ['ABS', 'Удароміцний'],
    description: 'Анатомічна форма, адаптована під конкретного користувача.',
  },
  {
    src: '/images/gallery/12.jpg',
    title: 'Адаптивний протез',
    category: 'Протези',
    tags: ['TPU', 'Гнучкі з\'єднання'],
    description: 'Модульна система, що дозволяє змінювати конфігурацію.',
  },
  {
    src: '/images/gallery/13.jpg',
    title: 'Комплексний протез',
    category: 'Протези',
    tags: ['Комбінований друк', 'PLA+TPU'],
    description: 'Поєднання жорстких та гнучких матеріалів для максимальної функціональності.',
  },
  // Механізми та прототипи
  {
    src: '/images/gallery/4.jpg',
    title: 'Коробка передач (прототип)',
    category: 'Механізми',
    tags: ['ABS', 'Шліфування'],
    description: 'Тестовий зразок складної механічної системи з рухомими елементами.',
  },
  // Фігурки (мистецькі роботи)
  {
    src: '/images/gallery/18.jpg',
    title: 'Фігурка Телелан',
    category: 'Арт-фігурки',
    tags: ['PLA', 'Багатоколірний AMS'],
    description: 'Авторська модель з деталізацією до 0.1 мм, надрукована в 4 кольори.',
  },
  {
    src: '/images/gallery/19.jpg',
    title: 'Фігурка Чаплін',
    category: 'Арт-фігурки',
    tags: ['PLA', 'Постобробка'],
    description: 'Художня мініатюра з ручною обробкою та фарбуванням.',
  },
  // Додаткові складні зразки
  {
    src: '/images/gallery/1.jpg',
    title: 'Масажний ролер (ергономічний)',
    category: 'Функціональний дизайн',
    tags: ['TPU', 'Текстурована поверхня'],
    description: 'Виріб складної форми з оптимізованою структурою для масажу.',
  },
];

// =========================
// 5. Головний компонент Hero
// =========================
export default function Hero({ data }: { data?: any }) {
  const [calcOpen, setCalcOpen] = useState(false);
  const [showNewGenModal, setShowNewGenModal] = useState(false);

  // Дефолтні значення, якщо data відсутня
  const heroData = data || {
    title: 'Ваші ідеї у 3D',
    subtitle: 'Професійний 3D-друк на замовлення. Швидко, якісно, доступно. Допомагаємо ЗСУ – друкуємо адаптери, кріплення та тактичні аксесуари.',
    buttonText: 'Замовити друк'
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), {
    stiffness: 80,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), {
    stiffness: 80,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1a3c34] via-[#1a3c34] to-[#2d5a4b]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <FloatingShapes />
        <TinyDots />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/80 via-transparent to-transparent pointer-events-none" />

        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center py-20 relative z-10">
          {/* Ліва частина – текст */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#7ec8a3] border border-[#7ec8a3]/20 mb-4"
            >
              🚀 3D-друк нового покоління
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
              Втілюємо <br />
              <TypewriterText text={heroData.title} className="text-[#7ec8a3]" />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 max-w-lg mb-8"
            >
              {heroData.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Button href="/order" variant="primary" className="group relative overflow-hidden">
                <span className="relative z-10">{heroData.buttonText}</span>
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
              </Button>

              <Button
                onClick={() => setCalcOpen(true)}
                variant="secondary"
                className="text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c]/10"
              >
                Розрахувати вартість
              </Button>

              <Button
                onClick={() => setShowNewGenModal(true)}
                variant="primary"
                className="relative overflow-hidden bg-gradient-to-r from-[#c9a84c] to-[#b89a3e] text-[#1a3c34] font-bold px-6 py-3 shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 transition-all"
              >
                <span className="relative z-10">✨ Розробка авторських моделей</span>
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 mt-8 text-sm text-gray-400"
            >
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span> 4.9 (120+ відгуків)
              </span>
              <span className="w-px h-6 bg-gray-700" />
              <span>🚀 Друк від 1 дня</span>
            </motion.div>
          </motion.div>

          {/* Права частина – зображення принтера X1 Carbon */}
          <motion.div className="relative flex justify-center" style={{ perspective: 1000 }}>
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="relative w-full max-w-lg aspect-square"
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-[#7ec8a3]/20 border-2 border-[#7ec8a3]/30">
                <Image
                  src="/images/printer/x1carbon.jpg"
                  alt="Bambu Lab X1 Carbon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3c34]/40 to-transparent" />
              </div>

              {/* Плаваючі картки з інформацією */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7ec8a3]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#7ec8a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Bambu Lab X1 Carbon</p>
                    <p className="text-xs text-gray-300">256×256×256 мм</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🖨️</span>
                  <div>
                    <p className="text-xs font-bold text-white">Точність</p>
                    <p className="text-xs text-gray-300">0.1 мм</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-12 -right-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold text-white">Швидкість</p>
                    <p className="text-xs text-gray-300">до 500 мм/с</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Стрілка вниз */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 cursor-pointer z-20"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={scrollToFeatures}
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Калькулятор */}
      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />

      {/* ============================================================
          МОДАЛКА "Супер взірці 3D-друку нового покоління"
          ============================================================ */}
      <AnimatePresence>
        {showNewGenModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowNewGenModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl transition z-10 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center"
                onClick={() => setShowNewGenModal(false)}
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <span className="inline-block text-5xl mb-2">✨</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1a3c34]">
                  Супер взірці 3D-друку нового покоління
                </h2>
                <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                  Це не просто галерея – це наші найскладніші, найунікальніші проєкти,
                  створені на замовлення. Тут ви побачите{' '}
                  <span className="font-semibold text-[#c9a84c]">багатокольоровий друк (AMS)</span>,
                  <span className="font-semibold text-[#c9a84c]"> функціональні протези</span>,
                  <span className="font-semibold text-[#c9a84c]"> складні механізми</span> та
                  <span className="font-semibold text-[#c9a84c]"> художні мініатюри</span>.
                </p>
              </div>

              {/* Групування за категоріями */}
              {['Протези', 'Механізми', 'Арт-фігурки', 'Функціональний дизайн'].map((cat) => {
                const items = newGenItems.filter((item) => item.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-6">
                    <h3 className="text-xl font-bold text-[#1a3c34] mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#c9a84c] rounded-full"></span>
                      {cat}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {items.map((img, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, zIndex: 10 }}
                          className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
                        >
                          <Image
                            src={img.src}
                            alt={img.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110 duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
                            <p className="text-white text-sm font-bold">{img.title}</p>
                            <p className="text-white/80 text-xs">{img.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {img.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-[#c9a84c]/80 text-white text-[10px] px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Технологічний блок */}
              <div className="bg-gradient-to-r from-[#1a3c34]/5 to-[#c9a84c]/10 rounded-xl p-4 mb-6 border border-[#c9a84c]/20">
                <h4 className="font-bold text-[#1a3c34] flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Чому це нове покоління?
                </h4>
                <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-[#c9a84c]">✔</span> Багатоколірний друк (AMS) до 16 кольорів
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c9a84c]">✔</span> Точність до 0.05 мм
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c9a84c]">✔</span> Складні геометрії без підтримок
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#c9a84c]">✔</span> Інженерні та біосумісні матеріали
                  </li>
                </ul>
              </div>

              <div className="text-center space-y-3">
                <p className="text-gray-500 text-sm">
                  Хочете створити щось подібне або навіть складніше? Ми розробимо унікальну модель спеціально для вас.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    href="/services"
                    variant="primary"
                    className="bg-[#c9a84c] text-[#1a3c34] hover:bg-[#b89a3e]"
                  >
                    ✨ Замовити індивідуальну розробку
                  </Button>
                  <Button href="/gallery" variant="secondary">
                    Переглянути всі роботи
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Кожен проєкт – унікальний, створений з урахуванням ваших побажань і технічних вимог.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}