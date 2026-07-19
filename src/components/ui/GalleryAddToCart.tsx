'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryAddToCartProps {
  item: {
    id: string;
    title: string;
    price: number;
    discount?: number;
    originalPrice?: number;
    category: string;
    image: string;
  };
}

export default function GalleryAddToCart({ item }: GalleryAddToCartProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const finalPrice = item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;

  const handleAdd = () => {
    addItem({
      id: item.id,
      title: item.title,
      price: finalPrice,
      originalPrice: item.originalPrice || item.price,
      category: item.category,
      image: item.image,
      quantity: quantity,
    });
    setShowModal(false);
    alert(`✅ ${item.title} додано до кошика!`);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-full bg-[#c9a84c] text-[#1a3c34] font-bold hover:bg-[#b89a3e] transition-all duration-200 shadow-lg flex items-center gap-2 text-sm"
      >
        🛒 Купити
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#1a3c34]">{item.title}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Категорія: {item.category}</p>
                <p className="text-2xl font-bold text-[#1a3c34]">{finalPrice} грн</p>
                {item.originalPrice && item.originalPrice > item.price && (
                  <p className="text-sm text-red-500 line-through">{item.originalPrice} грн</p>
                )}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Кількість:</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="w-full py-3 bg-[#1a3c34] text-white rounded-xl font-bold hover:bg-[#2d5a4b] transition"
              >
                Додати до кошика
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}