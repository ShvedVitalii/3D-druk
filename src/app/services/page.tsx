'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import FileUpload from '@/components/forms/FileUpload';

const serviceFileConfig: Record<number, { allowedExtensions: string[]; maxSize: number }> = {
  1: { allowedExtensions: ['stl', 'obj', '3mf', 'step', 'iges', 'stp'], maxSize: 50 * 1024 * 1024 },
  2: { allowedExtensions: ['stl', 'obj', '3mf', 'step', 'iges', 'stp'], maxSize: 50 * 1024 * 1024 },
  3: { allowedExtensions: ['png', 'jpg', 'jpeg', 'svg', 'ai', 'eps', 'pdf'], maxSize: 50 * 1024 * 1024 },
  4: { allowedExtensions: ['jpg', 'png', 'pdf'], maxSize: 50 * 1024 * 1024 },
  5: { allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'png'], maxSize: 50 * 1024 * 1024 },
  6: { allowedExtensions: ['stl', 'obj', '3mf', 'step'], maxSize: 50 * 1024 * 1024 },
  7: { allowedExtensions: ['stl', 'obj', '3mf', 'step'], maxSize: 50 * 1024 * 1024 },
  8: { allowedExtensions: ['stl', 'obj', 'ply', 'xyz'], maxSize: 50 * 1024 * 1024 },
  9: { allowedExtensions: ['pdf', 'jpg', 'png'], maxSize: 50 * 1024 * 1024 },
  10: { allowedExtensions: ['svg', 'png', 'jpg', 'pdf'], maxSize: 50 * 1024 * 1024 },
  11: { allowedExtensions: ['jpg', 'png', 'pdf'], maxSize: 50 * 1024 * 1024 },
  12: { allowedExtensions: ['pdf', 'jpg', 'png', 'stl'], maxSize: 50 * 1024 * 1024 },
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [calculatorValues, setCalculatorValues] = useState<Record<string, any>>({});
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const [categories, setCategories] = useState<string[]>(['Всі']);
  const [minPrice, setMinPrice] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const serviceItem = data.find((item: any) => item.key === 'services');
        const items = serviceItem?.data || [];
        setServices(items);
        const cats = ['Всі', ...new Set(items.map((s: any) => s.category).filter(Boolean) as string[])];
        setCategories(cats);

        const pricingItem = data.find((item: any) => item.key === 'pricing');
        if (pricingItem?.data && Array.isArray(pricingItem.data) && pricingItem.data.length > 0) {
          const firstBlock = pricingItem.data[0];
          if (firstBlock && Array.isArray(firstBlock.items)) {
            const prices = firstBlock.items.map((item: any) => {
              const match = item.value.match(/(\d+)/);
              return match ? parseInt(match[1]) : 0;
            }).filter((p: number) => p > 0);
            if (prices.length > 0) {
              setMinPrice(Math.min(...prices));
            }
          }
        }
      } catch (err) {
        console.error('Помилка завантаження даних:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedService && selectedService.hasCalculator) {
      calculatePrice(selectedService);
    }
  }, [calculatorValues, selectedService]);

  const filtered = selectedCategory === 'Всі'
    ? services
    : services.filter((s: any) => s.category === selectedCategory);

  const handleCalculatorChange = (key: string, value: any) => {
    setCalculatorValues(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = (service: any) => {
    if (!service.hasCalculator || !service.calculatorFields) return;
    let basePrice = service.priceValue || 0;
    let weight = 1,
      quantity = 1;
    service.calculatorFields.forEach((field: any) => {
      if (field.type === 'select') {
        const selectedValue = calculatorValues[field.key];
        if (selectedValue !== undefined && selectedValue !== null) {
          basePrice = selectedValue;
        }
      }
      if (field.type === 'range') {
        const val = calculatorValues[field.key] ?? field.default;
        if (field.key === 'weight') {
          weight = val;
        } else if (field.key === 'quantity' || field.key === 'count' || field.key === 'variants') {
          quantity = val;
        }
      }
    });
    if (basePrice === 0) basePrice = service.priceValue || 0;
    let total = basePrice * weight * quantity;
    if (service.id === 1) {
      if (quantity >= 500) total = Math.round(total * 0.85);
      else if (quantity >= 100) total = Math.round(total * 0.85);
      else if (quantity >= 50) total = Math.round(total * 0.9);
      else if (quantity >= 10) total = Math.round(total * 0.95);
    }
    setCalculatedPrice(total);
  };

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('file', file);
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });
        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.fileUrl);
            } catch (e) {
              reject(new Error('Помилка обробки відповіді сервера'));
            }
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || 'Помилка завантаження файлу'));
            } catch (e) {
              reject(new Error(`Помилка завантаження: ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => {
          setIsUploading(false);
          reject(new Error('Помилка з\'єднання'));
        };
        xhr.send(formData);
      });
    } catch (e) {
      setIsUploading(false);
      throw e;
    }
  };

  const addToCartWithOptions = async (service: any) => {
    let fileUrl = '';
    if (service.hasFileUpload !== false && uploadedFile) {
      try {
        fileUrl = await uploadFile(uploadedFile);
        showToastMessage(`✅ Файл ${uploadedFile.name} завантажено!`);
      } catch (err: any) {
        showToastMessage(`❌ ${err.message}`);
        return;
      }
    }

    if (!service.hasCalculator || !service.calculatorFields) {
      const options: Record<string, any> = {};
      if (additionalInfo.trim()) options['Додаткова інформація'] = additionalInfo.trim();
      if (fileUrl) options['Файл'] = fileUrl;
      addItem({
        id: `service-${service.id}-${Date.now()}`,
        title: service.title,
        price: service.discount && service.discount > 0 && service.oldPriceValue
          ? Math.round(service.oldPriceValue * (1 - service.discount / 100))
          : service.priceValue || 0,
        image: '',
        category: service.category || 'Послуга',
        icon: service.emoji || '📦',
        options,
        originalPrice: service.oldPriceValue || undefined,
        discount: service.discount || 0,
      });
      showToastMessage(`✅ ${service.title} додано до кошика!`);
      setAdditionalInfo('');
      setUploadedFile(null);
      setSelectedService(null);
      return;
    }

    if (calculatedPrice === null) {
      calculatePrice(service);
      return;
    }

    const options: Record<string, any> = {};
    const values: Record<string, any> = {};
    service.calculatorFields.forEach((field: any) => {
      const val = calculatorValues[field.key] ?? field.default;
      values[field.key] = val;
      if (field.type === 'select' && field.options) {
        const option = field.options.find((o: any) => o.value === val);
        options[field.label] = option ? option.label : val;
      } else {
        options[field.label] = val;
      }
    });

    if (additionalInfo.trim()) options['Додаткова інформація'] = additionalInfo.trim();
    if (fileUrl) options['Файл'] = fileUrl;

    let basePrice = service.priceValue || 0;
    service.calculatorFields.forEach((field: any) => {
      if (field.type === 'select') {
        const selectedValue = values[field.key];
        if (selectedValue !== undefined && selectedValue !== null) {
          basePrice = selectedValue;
        }
      }
    });

    addItem({
      id: `service-${service.id}-${Date.now()}`,
      title: service.title,
      price: calculatedPrice,
      image: '',
      category: service.category || 'Послуга',
      icon: service.emoji || '📦',
      options,
      originalPrice: Math.round(calculatedPrice * 1.2),
      calculatorData: {
        fields: service.calculatorFields,
        values: values,
        basePrice: basePrice,
      },
    });
    showToastMessage(`✅ ${service.title} додано до кошика!`);
    setAdditionalInfo('');
    setUploadedFile(null);
    setCalculatedPrice(null);
    setCalculatorValues({});
    setSelectedService(null);
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openServiceModal = (service: any) => {
    setSelectedService(service);
    const initialValues: Record<string, any> = {};
    if (service.calculatorFields) {
      service.calculatorFields.forEach((field: any) => {
        initialValues[field.key] = field.default ?? (field.type === 'select' ? field.options?.[0]?.value ?? 0 : 1);
      });
    }
    setCalculatorValues(initialValues);
    setCalculatedPrice(null);
    setAdditionalInfo('');
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (service.hasCalculator && service.calculatorFields) {
      setTimeout(() => calculatePrice(service), 50);
    }
  };

  const displayPrice = (service: any) => {
    if (service.id === 1 && minPrice > 0) {
      return `від ${minPrice} грн/г`;
    }
    if (service.priceValue > 0) {
      return `${service.priceValue} ${service.unit || '₴'}`;
    }
    return service.price || 'Договірна';
  };

  // Функція для отримання акційної ціни та старої ціни
  const getPriceInfo = (service: any) => {
    if (service.discount && service.discount > 0 && service.oldPriceValue) {
      const finalPrice = Math.round(service.oldPriceValue * (1 - service.discount / 100));
      return {
        finalPrice,
        oldPrice: service.oldPriceValue,
        discount: service.discount,
        hasDiscount: true,
      };
    }
    if (service.oldPriceValue && service.oldPriceValue > service.priceValue) {
      const finalPrice = service.priceValue;
      const discount = Math.round(((service.oldPriceValue - finalPrice) / service.oldPriceValue) * 100);
      return {
        finalPrice,
        oldPrice: service.oldPriceValue,
        discount,
        hasDiscount: true,
      };
    }
    return {
      finalPrice: service.priceValue || 0,
      oldPrice: 0,
      discount: 0,
      hasDiscount: false,
    };
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto text-center">
        <p className="text-gray-500">Завантаження послуг...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto bg-white">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-24 right-4 z-50 bg-[#1a3c34] text-white px-6 py-4 rounded-xl shadow-2xl border border-[#c9a84c]/30 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <p className="font-medium text-sm">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white text-sm"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-black">Наші послуги</h1>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto mt-2">Оберіть послугу та замовте 3D-друк</p>
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">
          📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#1a3c34] text-white shadow-md shadow-[#1a3c34]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered
          .filter((s: any) => !s.hidden)
          .map((service: any, idx: number) => {
            const priceInfo = getPriceInfo(service);
            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
                className="group bg-white rounded-2xl border border-gray-100/80 transition-all duration-300 hover:border-gray-200 hover:shadow-xl flex flex-col overflow-hidden"
              >
                <div
                  className="h-0.5 w-full transition-all duration-300 group-hover:h-1"
                  style={{ backgroundColor: service.categoryColor || '#c9a84c' }}
                />

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-[#c9a84c]/5 transition">
                      {service.emoji || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                          style={{ backgroundColor: service.categoryColor || '#c9a84c' }}
                        >
                          {service.category || 'Послуга'}
                        </span>
                        {priceInfo.hasDiscount && (
                          <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                            -{priceInfo.discount}%
                          </span>
                        )}
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
                      {priceInfo.hasDiscount ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold text-[#1a3c34] tracking-tight">
                            {service.id === 1 && minPrice > 0 
                              ? `від ${minPrice} грн/г` 
                              : `${priceInfo.finalPrice} ${service.unit || '₴'}`
                            }
                          </span>
                          {priceInfo.oldPrice > 0 && (
                            <span className="text-sm text-red-500 line-through">
                              {priceInfo.oldPrice} {service.unit || '₴'}
                            </span>
                          )}
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                            -{priceInfo.discount}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-[#1a3c34] tracking-tight">
                          {displayPrice(service)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {service.id === 1 ? (
                        <button
                          onClick={() => window.location.href = '/order'}
                          className="w-full px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                        >
                          <span>📋</span> Замовити
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => openServiceModal(service)}
                            className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200"
                          >
                            Детальніше
                          </button>
                          {service.priceValue > 0 ? (
                            <button
                              onClick={() => openServiceModal(service)}
                              className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                            >
                              <span>🛒</span> Купити
                            </button>
                          ) : (
                            <button
                              onClick={() => openServiceModal(service)}
                              className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-200"
                            >
                              Замовити
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">Немає послуг у цій категорії</div>
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-700 text-sm mb-4">Не знайшли потрібну послугу?</p>
        <button
          onClick={() => window.location.href = '/contacts'}
          className="px-6 py-2.5 rounded-full border-2 border-[#c9a84c] text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c] hover:text-white transition-all duration-300"
        >
          Зв'язатися з нами
        </button>
      </div>

      {/* Модальне вікно */}
      <AnimatePresence>
        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedService(null);
              setCalculatorValues({});
              setCalculatedPrice(null);
              setAdditionalInfo('');
              setUploadedFile(null);
              setUploadProgress(0);
              setIsUploading(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-6 border-b border-gray-100 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-4xl flex-shrink-0">
                    {selectedService.emoji || '📦'}
                  </div>
                  <div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: selectedService.categoryColor || '#c9a84c' }}
                    >
                      {selectedService.category || 'Послуга'}
                    </span>
                    <h2 className="text-2xl font-bold text-[#1a3c34] mt-1">{selectedService.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setCalculatorValues({});
                    setCalculatedPrice(null);
                    setAdditionalInfo('');
                    setUploadedFile(null);
                    setUploadProgress(0);
                    setIsUploading(false);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-2xl transition w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-base mb-4">{selectedService.longDesc || selectedService.description}</p>

                {selectedService.id === 1 && (
                  <div className="mb-4 space-y-3">
                    <div className="bg-gradient-to-r from-[#1a3c34] to-[#2d5a4b] rounded-xl p-5 text-white shadow-lg">
                      <h5 className="font-bold text-[#c9a84c] flex items-center gap-2 mb-3">
                        <span className="text-xl">🎯</span>
                        <span>Для постійних клієнтів та серійного виробництва</span>
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
                          <div className="text-2xl font-bold text-[#7ec8a3]">10+</div>
                          <div className="text-xs text-white/70">виробів</div>
                          <div className="text-lg font-bold text-[#c9a84c]">-5%</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
                          <div className="text-2xl font-bold text-[#7ec8a3]">50+</div>
                          <div className="text-xs text-white/70">виробів</div>
                          <div className="text-lg font-bold text-[#c9a84c]">-10%</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
                          <div className="text-2xl font-bold text-[#7ec8a3]">100+</div>
                          <div className="text-xs text-white/70">виробів</div>
                          <div className="text-lg font-bold text-[#c9a84c]">-15%</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10 border-dashed">
                          <div className="text-2xl font-bold text-[#c9a84c]">500+</div>
                          <div className="text-xs text-white/70">виробів</div>
                          <div className="text-sm font-semibold text-[#7ec8a3]">індивідуально</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <p className="text-sm text-amber-800 font-semibold">Мінімальна вартість 3D-моделювання</p>
                        <p className="text-xl font-bold text-[#1a3c34]">1 000 ₴</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedService.hasCalculator && selectedService.calculatorFields && selectedService.calculatorFields.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4">
                    <h4 className="text-base font-bold text-[#1a3c34] mb-4 flex items-center gap-2">🧮 Розрахунок вартості</h4>
                    <div className="space-y-4">
                      {selectedService.calculatorFields.map((field: any) => {
                        if (field.type === 'select' && field.options) {
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                              <select
                                value={calculatorValues[field.key] ?? field.default ?? field.options?.[0]?.value ?? 0}
                                onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                className="w-full p-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                              >
                                {field.options.map((opt: any) => (
                                  <option key={opt.label} value={opt.value}>
                                    {opt.label} ({opt.value} {field.unit || '₴/г'})
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        } else if (field.type === 'range') {
                          const currentVal = calculatorValues[field.key] ?? field.default ?? field.min ?? 1;
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={field.min ?? 1}
                                  max={field.max ?? 100}
                                  step={field.step ?? 1}
                                  value={currentVal}
                                  onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                  className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
                                />
                                <input
                                  type="number"
                                  min={field.min ?? 1}
                                  max={field.max ?? 100}
                                  step={field.step ?? 1}
                                  value={currentVal}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (
                                      !isNaN(val) &&
                                      field.min !== undefined &&
                                      field.max !== undefined &&
                                      val >= field.min &&
                                      val <= field.max
                                    ) {
                                      handleCalculatorChange(field.key, val);
                                    }
                                  }}
                                  className="w-20 p-2 text-center bg-white rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">від {field.min} до {field.max}</p>
                            </div>
                          );
                        } else {
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                              <input
                                type="number"
                                min={field.min ?? 1}
                                max={field.max ?? 1000}
                                step={field.step ?? 1}
                                value={calculatorValues[field.key] ?? field.default ?? field.min ?? 1}
                                onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                className="w-full p-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                              />
                              {field.min !== undefined && field.max !== undefined && (
                                <p className="text-xs text-gray-400 mt-1">від {field.min} до {field.max}</p>
                              )}
                            </div>
                          );
                        }
                      })}
                      {calculatedPrice !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center"
                        >
                          <p className="text-sm text-gray-600">Вартість:</p>
                          <p className="text-3xl font-bold text-[#1a3c34]">{calculatedPrice} ₴</p>
                          {selectedService.id === 1 && (
                            <p className="text-xs text-gray-500 mt-1">* З урахуванням знижки (за наявності)</p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {selectedService.additionalInfoLabel || 'Додаткова інформація (необов\'язково)'}
                    </label>
                    <textarea
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Напишіть тут усі деталі, які вважаєте важливими..."
                      rows={3}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                    />
                  </div>

                  {selectedService.hasFileUpload !== false && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Завантажте файл <span className="text-xs text-gray-400">(необов'язково)</span>
                      </label>
                      {(() => {
                        const config = serviceFileConfig[selectedService.id] || { allowedExtensions: [], maxSize: 50 * 1024 * 1024 };
                        const accept = config.allowedExtensions.map(ext => `.${ext}`).join(',');
                        return (
                          <FileUpload
                            onFileSelect={setUploadedFile}
                            accept={accept}
                            maxSize={config.maxSize}
                            allowedExtensions={config.allowedExtensions}
                            label="Перетягніть файл або клікніть для вибору"
                          />
                        );
                      })()}
                      {uploadedFile && (
                        <p className="text-[#1a3c34] text-sm mt-2">✅ Вибрано: {uploadedFile.name}</p>
                      )}
                      {isUploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-[#c9a84c] h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Завантаження: {uploadProgress}%</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {(() => {
                          const config = serviceFileConfig[selectedService.id] || { allowedExtensions: [], maxSize: 50 * 1024 * 1024 };
                          return `Дозволені формати: ${config.allowedExtensions.join(', ') || 'всі'}. Макс. розмір: ${Math.round(config.maxSize / (1024 * 1024))} МБ`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Вартість</p>
                    <p className="text-2xl font-bold text-[#1a3c34]">
                      {calculatedPrice !== null ? `${calculatedPrice} ₴` : selectedService.price || 'Договірна'}
                    </p>
                    {selectedService.oldPriceValue && selectedService.oldPriceValue > 0 && (
                      <p className="text-sm text-red-500 line-through">{selectedService.oldPriceValue} ₴</p>
                    )}
                    {selectedService.discount && selectedService.discount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold inline-block mt-1">
                        -{selectedService.discount}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCartWithOptions(selectedService)}
                    disabled={isUploading}
                    className={`px-8 py-2.5 rounded-xl bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-300 shadow-md shadow-[#1a3c34]/20 text-base ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? 'Завантаження...' : selectedService.priceValue > 0 ? 'Додати в кошик' : 'Замовити'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}