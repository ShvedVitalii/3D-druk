'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FloatingContact() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-3"
    >
      <Link
        href="/order"
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#b89a3e] shadow-2xl shadow-[#c9a84c]/40 hover:scale-105 transition"
      >
        <span className="absolute inset-0 rounded-full animate-pulse-ring"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </Link>
      <span className="text-xs font-medium bg-white/90 px-3 py-1 rounded-full shadow-md text-[#1a3c34]">Зателефонувати</span>
    </motion.div>
  );
}