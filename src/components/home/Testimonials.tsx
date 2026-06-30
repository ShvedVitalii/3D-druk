'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const testimonials = [
  { text: 'Надрукували прототип деталі за 2 дні — якість супер! Рекомендую всім інженерам.', author: 'Іван, інженер', rating: 5 },
  { text: 'Замовляв фігурку для сина — вийшло краще, ніж очікував. Дуже деталізовано.', author: 'Олена, мама', rating: 5 },
  { text: 'Допомогли з друком адаптерів для ЗСУ — швидко і абсолютно безкоштовно. Велике дякую!', author: 'Волонтер', rating: 5 },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isPaused && isInView) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, isInView]);

  return (
    <section ref={ref} className="py-28 bg-[#f5f0eb]">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 text-[#1a3c34]"
        >
          Відгуки клієнтів
        </motion.h2>
        <div
          className="max-w-3xl mx-auto cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, type: 'spring', damping: 20 }}
              className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-[#c9a84c] relative"
            >
              <div className="absolute -top-4 -left-4 text-6xl text-[#c9a84c]/20">“</div>
              <p className="text-gray-700 text-lg mb-4 relative z-10">{testimonials[index].text}</p>
              <div className="flex items-center gap-3">
                <div className="flex text-[#c9a84c]">{"★".repeat(testimonials[index].rating)}</div>
                <span className="text-sm font-bold text-[#1a3c34]">— {testimonials[index].author}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all duration-300 ${i === index ? 'w-10 bg-[#c9a84c]' : 'w-3 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}