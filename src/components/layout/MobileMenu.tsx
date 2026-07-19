'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

export default function MobileMenu({ isOpen, onClose, links }: { isOpen: boolean; onClose: () => void; links: { href: string; label: string }[] }) {
  const [mounted, setMounted] = useState(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const pathname = usePathname();

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
              {links.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 text-lg font-medium transition-colors py-3 px-4 rounded-xl group ${
                        isActive 
                          ? 'text-[#c9a84c] bg-[#f5f0eb]' 
                          : 'text-gray-700 hover:text-[#c9a84c] hover:bg-[#f5f0eb]'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full transition-all ${
                        isActive ? 'bg-[#c9a84c] w-3' : 'bg-[#c9a84c]'
                      }`} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Кошик */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.05 }}
              >
                <Link
                  href="/cart"
                  onClick={onClose}
                  className={`flex items-center gap-3 text-lg font-medium transition-colors py-3 px-4 rounded-xl group ${
                    pathname === '/cart' 
                      ? 'text-[#c9a84c] bg-[#f5f0eb]' 
                      : 'text-gray-700 hover:text-[#c9a84c] hover:bg-[#f5f0eb]'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full transition-all ${
                    pathname === '/cart' ? 'bg-[#c9a84c] w-3' : 'bg-[#c9a84c]'
                  }`} />
                  Кошик
                  {cartCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Замовити - змінено: прибрано крапку, текст по центру */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (links.length + 1) * 0.05 }}
              >
                <Link
                  href="/order"
                  onClick={onClose}
                  className={`flex items-center justify-center text-lg font-medium transition-colors py-3 px-4 rounded-xl ${
                    pathname === '/order' 
                      ? 'bg-[#c9a84c] text-white' 
                      : 'bg-[#1a3c34] text-white hover:bg-[#2d5a4b]'
                  }`}
                >
                  Замовити
                </Link>
              </motion.div>
            </nav>

            <div className="p-6 border-t border-gray-200 space-y-4">
              <div className="flex justify-center gap-4 text-gray-400">
                <a href="https://t.me/3d_print" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a84c] transition">Telegram</a>
                <a href="https://instagram.com/3d_print_ua" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a84c] transition">Instagram</a>
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