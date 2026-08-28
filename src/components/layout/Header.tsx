'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' },
  { href: '/printer', label: 'Принтери' },
  { href: '/gallery', label: 'Каталог' },
  { href: '/contacts', label: 'Контакти' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#d0c8c0] shadow-sm">
      <div className="container-custom flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-heading font-bold text-[#1a3c34]">
          3D-друк
        </Link>

        <nav className="hidden md:flex space-x-8 text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium hover:text-[#c9a84c] transition duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-gray-700 hover:text-[#c9a84c] transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <Button
            href="/order"
            variant="primary"
            className="hidden md:inline-flex items-center justify-center"
          >
            Замовити
          </Button>

          <button
            className="md:hidden text-gray-700 text-3xl focus:outline-none hover:text-[#c9a84c] transition"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} links={navLinks} />
    </header>
  );
}