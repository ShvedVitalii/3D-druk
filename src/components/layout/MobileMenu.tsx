'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMenu({ isOpen, onClose, links }: { isOpen: boolean; onClose: () => void; links: { href: string; label: string }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-[#d0c8c0] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <span className="text-2xl font-serif font-bold text-[#1a3c34]">3D-друк</span>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5f0eb] text-[#1a3c34] hover:bg-[#e8e0d8] transition-colors"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-2 p-6">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-[#c9a84c] transition-colors py-3 px-4 rounded-xl hover:bg-[#f5f0eb] group"
                  >
                    <span className="w-1 h-1 bg-[#c9a84c] rounded-full group-hover:w-2 transition-all" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="p-6 border-t border-gray-200 space-y-4">
              <Button href="/order" variant="primary" onClick={onClose} className="w-full justify-center">
                📞 Замовити дзвінок
              </Button>
              <div className="flex justify-center gap-4 text-gray-400">
                <a href="#" className="hover:text-[#c9a84c] transition">Telegram</a>
                <a href="#" className="hover:text-[#c9a84c] transition">Instagram</a>
                <a href="#" className="hover:text-[#c9a84c] transition">Facebook</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(menuContent, document.body);
}