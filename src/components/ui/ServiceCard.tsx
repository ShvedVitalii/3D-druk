'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceCardProps {
  service: any;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: `service-${service.id}`,
      title: service.title,
      price: service.priceValue || 0,
      category: service.category,
      icon: service.emoji,
      quantity: quantity,
      options: { material: service.category, price: service.price },
    });
    alert(`✅ ${service.title} додано до кошика!`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100/80 transition-all duration-300 hover:border-gray-200 hover:shadow-xl flex flex-col overflow-hidden">
      <div
        className="h-0.5 w-full transition-all duration-300 group-hover:h-1"
        style={{ backgroundColor: service.categoryColor }}
      />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-[#c9a84c]/5 transition">
            {service.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: service.categoryColor }}
              >
                {service.category}
              </span>
              {service.hasCalculator && (
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  🧮
                </span>
              )}
              {service.hasFileUpload !== false && (
                <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  📎
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[#1a3c34] mt-1.5 leading-snug group-hover:text-[#c9a84c] transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="mb-3">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Ціна</span>
            <span className="text-xl font-bold text-[#1a3c34] tracking-tight">
              {service.price}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200"
            >
              Детальніше
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
            >
              <span>🛒</span> {service.priceValue > 0 ? 'Купити' : 'Замовити'}
            </button>
          </div>
        </div>
      </div>

      {/* Модалка деталей */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetails(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#1a3c34]">{service.title}</h3>
                <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>
              <p className="text-gray-600 mb-4">{service.longDesc || service.description}</p>
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-500">Ціна: <span className="font-bold text-[#1a3c34]">{service.price}</span></p>
                {service.category && <p className="text-sm text-gray-500">Категорія: {service.category}</p>}
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
                onClick={() => {
                  handleAddToCart();
                  setShowDetails(false);
                }}
                className="w-full py-3 bg-[#1a3c34] text-white rounded-xl font-bold hover:bg-[#2d5a4b] transition"
              >
                Додати до кошика
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}