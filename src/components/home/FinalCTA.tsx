'use client';
import Button from '@/components/ui/Button';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FinalCTA({ data }: { data?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const ctaData = data || {
    title: 'Готові втілити ідею?',
    subtitle: 'Надішліть файл моделі – розрахуємо вартість за 15 хвилин.',
    buttonText: 'Замовити зараз',
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden bg-gradient-to-r from-[#1a3c34] to-[#2d5a4b]">
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#7ec8a3]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#c9a84c]/10 to-transparent" />
      </div>

      <div className="container-custom text-center max-w-3xl mx-auto relative z-10">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', damping: 15 }}
          className="mb-4 text-white text-4xl md:text-5xl"
        >
          {ctaData.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-[#7ec8a3] mb-8 text-lg max-w-xl mx-auto"
        >
          {ctaData.subtitle}
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Button href="/order" variant="primary" className="text-lg px-10 py-4 bg-[#c9a84c] text-[#1a3c34] hover:bg-[#b89a3e] shadow-2xl shadow-[#c9a84c]/20">
            {ctaData.buttonText}
          </Button>
        </motion.div>
        <div className="flex justify-center gap-6 mt-6 text-white/60 text-sm">
          <span>✔ Безкоштовна консультація</span>
          <span>✔ Швидкий розрахунок</span>
        </div>
      </div>
    </section>
  );
}