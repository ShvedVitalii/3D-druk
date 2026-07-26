'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';

interface GalleryAddToCartProps {
  item: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    originalPrice?: number;
    category: string;
    image: string;
    maxQuantity?: number;
    inStock?: boolean;
  };
  buttonText?: string;
  className?: string;
  showAnimation?: boolean;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  hideQuantityControls?: boolean;
}

export default function GalleryAddToCart({
  item,
  buttonText = 'Додати в кошик',
  className = '',
  showAnimation = true,
  quantity: externalQuantity,
  onQuantityChange,
  hideQuantityControls = false,
}: GalleryAddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);
  const [internalQuantity, setInternalQuantity] = useState(1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<HTMLElement | null>(null);

  const quantity = externalQuantity !== undefined ? externalQuantity : internalQuantity;
  const maxQty = item.maxQuantity ?? Infinity;
  const isInStock = item.inStock !== undefined ? item.inStock : true;

  useEffect(() => {
    setMounted(true);
    cartIconRef.current = document.querySelector('header a[href="/cart"]') ||
      document.querySelector('.cart-icon') ||
      document.querySelector('a[href="/cart"]');
    return () => setMounted(false);
  }, []);

  const handleQuantityChange = (newQty: number) => {
    const clamped = Math.min(Math.max(1, newQty), maxQty);
    if (onQuantityChange) {
      onQuantityChange(clamped);
    } else {
      setInternalQuantity(clamped);
    }
  };

  const performAdd = () => {
    if (!isInStock || quantity <= 0) return;

    const finalPrice = item.discount
      ? Math.round(item.price * (1 - (item.discount || 0) / 100))
      : item.price;

    addItem({
      id: item.id,
      title: item.title,
      price: finalPrice,
      originalPrice: item.originalPrice || item.price,
      discount: item.discount || 0,
      category: item.category,
      image: item.image,
      quantity: quantity,
      maxQuantity: item.maxQuantity,
    });

    const toastEvent = new CustomEvent('showToast', {
      detail: { message: `✅ ${item.title} додано до кошика!` },
    });
    window.dispatchEvent(toastEvent);
  };

  const handleAddWithAnimation = () => {
    if (!isInStock || quantity <= 0) return;

    if (showAnimation && buttonRef.current && cartIconRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const cartRect = cartIconRef.current.getBoundingClientRect();

      const flyer = document.createElement('div');
      flyer.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2 - 30}px;
        top: ${rect.top + rect.height / 2 - 30}px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 99999;
        pointer-events: none;
        transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      const img = document.createElement('img');
      img.src = item.image;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      flyer.appendChild(img);
      document.body.appendChild(flyer);

      requestAnimationFrame(() => {
        flyer.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
        flyer.style.top = `${cartRect.top + cartRect.height / 2 - 20}px`;
        flyer.style.width = '40px';
        flyer.style.height = '40px';
        flyer.style.opacity = '0.7';
        flyer.style.transform = 'scale(0.3) rotate(20deg)';
      });

      setTimeout(() => {
        flyer.remove();
        performAdd();
      }, 1200);
    } else {
      performAdd();
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {!hideQuantityControls && isInStock && (
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
            >
              −
            </button>
            <span className="w-8 text-center font-bold text-sm">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
            >
              +
            </button>
          </div>
        )}
        <button
          ref={buttonRef}
          onClick={handleAddWithAnimation}
          disabled={!isInStock || quantity <= 0}
          className={className || "px-4 py-2 rounded-full bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"}
        >
          🛒 {buttonText}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!hideQuantityControls && isInStock && (
        <>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
            >
              −
            </button>
            <span className="w-8 text-center font-bold text-sm">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
            >
              +
            </button>
          </div>
          {maxQty !== Infinity && (
            <span className="text-xs text-gray-400">(макс. {maxQty})</span>
          )}
        </>
      )}
      {!isInStock && (
        <span className="text-sm text-red-500 font-medium">Немає в наявності</span>
      )}
      <button
        ref={buttonRef}
        onClick={handleAddWithAnimation}
        disabled={!isInStock || quantity <= 0}
        className={className || "px-4 py-2 rounded-full bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"}
      >
        🛒 {buttonText}
      </button>
    </div>
  );
}