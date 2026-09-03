'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import CalculatorModal from '@/components/order/CalculatorModal';
import Link from 'next/link';

// =========================
// 1. Друкарський текст
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
// 2. Головний компонент Hero
// =========================
export default function Hero({ data }: { data?: any }) {
  const [calcOpen, setCalcOpen] = useState(false);
  const [showNewGenModal, setShowNewGenModal] = useState(false);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCustomModels() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const modelItem = items.find((item: any) => item.key === 'custom_models');
        if (modelItem?.data && Array.isArray(modelItem.data) && modelItem.data.length > 0) {
          setModels(modelItem.data);
        }
      } catch (err) {
        console.error('Помилка завантаження авторських моделей:', err);
      }
    }
    fetchCustomModels();
  }, []);

  const heroData = data || {
    title: 'Ваші ідеї у 3D',
    subtitle:
      'Професійний 3D-друк на замовлення. Швидко, якісно, доступно. Допомагаємо ЗСУ – друкуємо адаптери, кріплення та тактичні аксесуари.',
    buttonText: 'Замовити друк',
    heroVideo: '',
    donationButtonText: 'Донат',
    donationLink: 'https://send.monobank.ua/jar/4XgUntFv2W',
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {heroData.heroVideo ? (
          <video
            src={heroData.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a3c34] via-[#1a3c34] to-[#2d5a4b]" />
        )}
        
        <div className="absolute inset-0 z-10 bg-black/40" />

        <div className="container-custom relative z-20 py-20 flex items-center justify-start min-h-screen w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: 'spring', damping: 20 }}
            className="text-white max-w-3xl w-full text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-[#7ec8a3] border border-[#7ec8a3]/20 mb-4"
            >
              <Link href="/gallery" className="block w-full h-full">
                🔥 Акційні вироби до -90%
              </Link>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6">
  <TypewriterText text={heroData.title} className="text-[#7ec8a3]" />
</h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-200 max-w-lg mb-8"
            >
              {heroData.subtitle}
            </motion.p>

            {/* ===== КНОПКИ – КРАСИВЕ РОЗТАШУВАННЯ ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-4 items-start"
            >
              {/* Перший ряд: Замовити друк + Розрахувати вартість */}
              <div className="flex flex-wrap gap-4">
                <Button
                  href="/order"
                  variant="primary"
                  className="bg-[#1a3c34] text-white hover:bg-[#2d5a4b] shadow-lg shadow-[#1a3c34]/30 hover:shadow-[#1a3c34]/50 text-lg px-8 py-4 transition-all duration-300 hover:scale-105"
                >
                  {heroData.buttonText}
                </Button>
                <Button
                  onClick={() => setCalcOpen(true)}
                  variant="secondary"
                  className="border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
                >
                  Розрахувати вартість
                </Button>
              </div>

              {/* Другий ряд: Авторські моделі + Донат (однакового розміру) */}
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setShowNewGenModal(true)}
                  variant="primary"
                  className="bg-gradient-to-r from-[#c9a84c] to-[#b89a3e] text-[#1a3c34] font-bold shadow-lg shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
                >
                  ✨ Розробка авторських моделей
                </Button>
                {heroData.donationLink && (
                  <Button
                    href={heroData.donationLink}
                    variant="secondary"
                    className="bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:border-red-500 hover:scale-105 transition-all duration-300 text-lg px-8 py-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ❤️ {heroData.donationButtonText || 'Донат'}
                  </Button>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 mt-8 text-sm text-gray-300"
            >
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span> 4.9 (120+ відгуків)
              </span>
              <span className="w-px h-6 bg-gray-600" />
              <span>🚀 Друк від 1 дня</span>
            </motion.div>
          </motion.div>
        </div>

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

      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />

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
                  створені на замовлення.
                </p>
              </div>
              {models.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Немає доданих моделей.</div>
              ) : (
                models.map((model: any) => (
                  <div key={model.id} className="mb-8">
                    <h3 className="text-xl font-bold text-[#1a3c34] mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#c9a84c] rounded-full"></span>
                      {model.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(model.elements || []).map((element: any) => (
                        <div
                          key={element.id}
                          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-gray-200"
                        >
                          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src={element.image || '/images/placeholder.jpg'}
                              alt={element.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-[#1a3c34] text-lg">{element.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{element.description}</p>
                            {element.tags && element.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {element.tags.map((tag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs px-2 py-0.5 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
              <div className="bg-gradient-to-r from-[#1a3c34]/5 to-[#c9a84c]/10 rounded-xl p-4 mb-6 border border-[#c9a84c]/20">
                <h4 className="font-bold text-[#1a3c34] flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Чому це нове покоління?
                </h4>
                <ul className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><span className="text-[#c9a84c]">✔</span> Багатоколірний друк (AMS) до 16 кольорів</li>
                  <li className="flex items-center gap-2"><span className="text-[#c9a84c]">✔</span> Точність до 0.05 мм</li>
                  <li className="flex items-center gap-2"><span className="text-[#c9a84c]">✔</span> Складні геометрії без підтримок</li>
                  <li className="flex items-center gap-2"><span className="text-[#c9a84c]">✔</span> Інженерні та біосумісні матеріали</li>
                </ul>
              </div>
              <div className="text-center space-y-3">
                <p className="text-gray-500 text-sm">Хочете створити щось подібне? Ми розробимо унікальну модель для вас.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button href="/services" variant="primary" className="bg-[#c9a84c] text-[#1a3c34] hover:bg-[#b89a3e]">
                    ✨ Замовити індивідуальну розробку
                  </Button>
                  <Button href="/gallery" variant="secondary">Переглянути всі роботи</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}