'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const navItems = [
  { href: '/admin', label: 'Головна', icon: '🏠' },
  { href: '/admin/services', label: 'Послуги', icon: '🖨️' },
  { href: '/admin/printers', label: 'Принтери', icon: '🖥️' },
  { href: '/admin/gallery', label: 'Каталог', icon: '🖼️' },
  { href: '/admin/contacts', label: 'Контакти', icon: '📞' },
  { href: '/admin/orders', label: 'Заявки', icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  // Закриваємо меню при зміні маршруту на мобільному
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  // Закриваємо меню при зміні розміру вікна на десктоп
  useEffect(() => {
    if (!isMobile) setIsOpen(false);
  }, [isMobile]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // На десктопі – завжди показуємо повну навігацію
  if (!isMobile) {
    return (
      <aside className="w-64 bg-[#1a3c34] text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-[#c9a84c]">3D-друк</h1>
          <p className="text-xs text-white/60 mt-1">Адмін-панель</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#c9a84c] text-[#1a3c34] font-semibold shadow-lg'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {item.label === 'Заявки' && (
                  <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            <span className="text-xl">🚪</span>
            <span>Вийти</span>
          </button>
        </div>
      </aside>
    );
  }

  // На мобільному – оверлей з кнопкою
  return (
    <>
      {/* Кнопка-бургер */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-[#1a3c34] text-white rounded-lg shadow-lg hover:bg-[#2d5a4b] transition"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Затемнення фону */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Бічна панель, що виїжджає */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a3c34] text-white z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#c9a84c]">3D-друк</h1>
            <p className="text-xs text-white/60 mt-1">Адмін-панель</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#c9a84c] text-[#1a3c34] font-semibold shadow-lg'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                {item.label === 'Заявки' && (
                  <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            <span className="text-xl">🚪</span>
            <span>Вийти</span>
          </button>
        </div>
      </aside>
    </>
  );
}