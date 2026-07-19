'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/components/ui/Toast';

interface ServiceCardProps {
  service: any;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Ініціалізуємо значення за замовчуванням з полів калькулятора
  const initConfig = () => {
    if (service.calculatorFields && service.calculatorFields.length > 0) {
      const defaults: Record<string, any> = {};
      service.calculatorFields.forEach((field: any) => {
        defaults[field.key] = field.default ?? (field.type === 'select' ? field.options?.[0]?.value ?? 0 : field.min ?? 1);
      });
      setConfigValues(defaults);
    } else {
      setConfigValues({});
    }
    setQuantity(1);
  };

  const openConfig = () => {
    initConfig();
    setShowConfig(true);
  };

  const handleFieldChange = (key: string, value: any) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }));
  };

  // Обчислення ціни на основі вибраних параметрів (якщо є калькулятор)
  const calculatePrice = () => {
    if (!service.calculatorFields || service.calculatorFields.length === 0) {
      return service.priceValue || 0;
    }

    let basePrice = service.priceValue || 0;
    let volume = 1;
    let count = 1;

    service.calculatorFields.forEach((field: any) => {
      const val = configValues[field.key] ?? field.default;
      if (field.type === 'select' && field.options) {
        const option = field.options.find((o: any) => o.value === val);
        if (option) basePrice = option.value;
      }
      if (field.type === 'range' || field.type === 'number') {
        if (field.key === 'volume' || field.key === 'size' || field.key === 'area') {
          volume = val;
        } else if (field.key === 'count' || field.key === 'quantity' || field.key === 'variants') {
          count = val;
        }
      }
    });

    return Math.round(basePrice * volume * count);
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice();
    const options: Record<string, any> = {};

    // Збираємо вибрані параметри для відображення в кошику
    if (service.calculatorFields && service.calculatorFields.length > 0) {
      service.calculatorFields.forEach((field: any) => {
        const val = configValues[field.key] ?? field.default;
        if (field.type === 'select' && field.options) {
          const option = field.options.find((o: any) => o.value === val);
          options[field.label] = option ? option.label : val;
        } else {
          options[field.label] = val;
        }
      });
    }

    addItem({
      id: `service-${service.id}-${Date.now()}`,
      title: service.title,
      price: finalPrice,
      category: service.category,
      icon: service.emoji,
      quantity: quantity,
      options: options,
      // Зберігаємо конфігурацію для можливості редагування в кошику
      calculatorData: service.calculatorFields ? {
        fields: service.calculatorFields,
        values: configValues,
        basePrice: service.priceValue || 0,
      } : undefined,
    });

    setShowConfig(false);
    setToastMessage(`✅ ${service.title} додано до кошика!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
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
                    🧮 Налаштування
                  </span>
                )}
                {service.hasFileUpload !== false && (
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    📎 Файл
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
                onClick={service.calculatorFields?.length ? openConfig : handleAddToCart}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
              >
                <span>🛒</span> {service.priceValue > 0 ? 'Купити' : 'Замовити'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка детального опису */}
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
              <div className="space-y-3">
                <p className="text-gray-600">{service.longDesc || service.description}</p>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Ціна: <span className="font-bold text-[#1a3c34]">{service.price}</span></p>
                  {service.category && <p className="text-sm text-gray-500">Категорія: {service.category}</p>}
                  {service.hasCalculator && (
                    <p className="text-sm text-blue-600">🧮 Ця послуга має додаткові налаштування</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  if (service.calculatorFields?.length) openConfig();
                  else handleAddToCart();
                }}
                className="mt-6 w-full py-3 bg-[#1a3c34] text-white rounded-xl font-bold hover:bg-[#2d5a4b] transition"
              >
                {service.calculatorFields?.length ? 'Налаштувати та купити' : 'Купити'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Модалка налаштувань послуги (з'являється при натисканні "Купити") */}
      <AnimatePresence>
        {showConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfig(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#1a3c34]">Налаштування: {service.title}</h3>
                <button onClick={() => setShowConfig(false)} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>

              {service.calculatorFields && service.calculatorFields.length > 0 ? (
                <div className="space-y-4">
                  {service.calculatorFields.map((field: any) => {
                    if (field.type === 'select') {
                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <select
                            value={configValues[field.key] ?? field.default}
                            onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                            className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                          >
                            {field.options.map((opt: any) => (
  <option key={opt.label} value={opt.value}>
                                {opt.label} ({opt.value} ₴)
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    if (field.type === 'range') {
                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={field.min}
                              max={field.max}
                              step={field.step || 1}
                              value={configValues[field.key] ?? field.default}
                              onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
                            />
                            <span className="text-sm font-bold text-[#1a3c34] min-w-[50px] text-center">
                              {configValues[field.key] ?? field.default}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">від {field.min} до {field.max}</p>
                        </div>
                      );
                    }
                    if (field.type === 'number') {
                      return (
                        <div key={field.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                          <input
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            value={configValues[field.key] ?? field.default}
                            onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                            className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                          />
                        </div>
                      );
                    }
                    return null;
                  })}

                  <div className="flex items-center gap-4">
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

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Вартість:</p>
                    <p className="text-2xl font-bold text-[#1a3c34]">{calculatePrice() * quantity} ₴</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Ця послуга не має додаткових налаштувань.
                  <div className="mt-2 flex items-center justify-center gap-4">
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
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="mt-6 w-full py-3 bg-[#1a3c34] text-white rounded-xl font-bold hover:bg-[#2d5a4b] transition"
              >
                Додати до кошика
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}