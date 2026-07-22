'use client';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeliverySelector from '@/components/order/DeliverySelector';

// ==================== МОДАЛКА РЕДАГУВАННЯ ====================
function EditModal({
  item,
  isOpen,
  onClose,
  onSave,
}: {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPrice: number, newOptions: Record<string, any>, newValues: Record<string, any>) => void;
}) {
  const [localPrice, setLocalPrice] = useState(item?.price || 0);
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [localOptions, setLocalOptions] = useState<Record<string, any>>({});

  useEffect(() => {
    if (item && isOpen) {
      setLocalPrice(item.price);
      if (item.calculatorData) {
        setLocalValues(item.calculatorData.values || {});
        setLocalOptions(item.options || {});
      } else {
        setLocalValues({});
        setLocalOptions({});
      }
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleFieldChange = (key: string, value: any) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    if (item.calculatorData) {
      const fields = item.calculatorData.fields;
      let basePrice = item.calculatorData.basePrice;
      let quantity = 1,
        volume = 1;
      const updatedValues = { ...localValues, [key]: value };
      fields.forEach((field: any) => {
        if (field.type === 'select') {
          const selectedValue = updatedValues[field.key];
          if (selectedValue !== undefined && selectedValue !== null) {
            basePrice = selectedValue;
          }
        }
        if (field.type === 'range') {
          const val = updatedValues[field.key] ?? field.default;
          if (field.key === 'quantity' || field.key === 'count' || field.key === 'variants') {
            quantity = val;
          } else if (field.key === 'volume' || field.key === 'area' || field.key === 'size') {
            volume = val;
          }
        }
      });
      const newPrice = Math.round(basePrice * volume * quantity);
      setLocalPrice(newPrice);
      const newOptions: Record<string, any> = {};
      fields.forEach((field: any) => {
        const val = updatedValues[field.key] ?? field.default;
        if (field.type === 'select' && field.options) {
          const option = field.options.find((o: any) => o.value === val);
          newOptions[field.label] = option ? option.label : val;
        } else {
          newOptions[field.label] = val;
        }
      });
      setLocalOptions(newOptions);
    }
  };

  const handleSave = () => {
    onSave(localPrice, localOptions, localValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#1a3c34]">Редагувати {item.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        {item.calculatorData ? (
          <div className="space-y-4">
            {item.calculatorData.fields.map((field: any) => {
              if (field.type === 'select') {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <select
                      value={localValues[field.key] ?? field.default}
                      onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                      className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                    >
                      {field.options.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} ({opt.value} ₴)
                        </option>
                      ))}
                    </select>
                  </div>
                );
              } else if (field.type === 'range') {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                        value={localValues[field.key] ?? field.default}
                        onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
                      />
                      <span className="text-sm font-bold text-[#1a3c34] min-w-[50px] text-center">
                        {localValues[field.key] ?? field.default}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">від {field.min} до {field.max}</p>
                  </div>
                );
              } else {
                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step || 1}
                      value={localValues[field.key] ?? field.default}
                      onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                      className="w-full p-2.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                    />
                  </div>
                );
              }
            })}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Нова вартість:</p>
              <p className="text-2xl font-bold text-[#1a3c34]">{localPrice} ₴</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>Цей товар не має параметрів для редагування.</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
            Скасувати
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition">
            Зберегти
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== ГОЛОВНИЙ КОМПОНЕНТ ====================
export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, updateItem } = useCartStore();
  const [delivery, setDelivery] = useState({
    city: '',
    warehouse: '',
    deliveryType: 'nova' as 'nova' | 'ukr' | 'pickup',
  });
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    city?: string;
    warehouse?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // ===== ОПЛАТА =====
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any[]>([]);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const total = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const hasConsultationOrVolunteer = items.some(item => 
    item.category === 'Консультації' || item.category === 'Соціальне'
  );

  // ===== ЗАВАНТАЖЕННЯ РЕКВІЗИТІВ =====
  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const items = await res.json();
      const paymentItem = items.find((item: any) => item.key === 'payment_details');
      if (paymentItem?.data) {
        if (Array.isArray(paymentItem.data)) {
          setPaymentDetails(paymentItem.data);
        } else if (typeof paymentItem.data === 'object' && paymentItem.data !== null) {
          setPaymentDetails([paymentItem.data]);
        } else {
          setPaymentDetails([]);
        }
      } else {
        setPaymentDetails([
          {
            recipientName: 'ФОП Комарницький Юрій',
            iban: 'UA123456789012345678901234567',
            bankName: 'Монобанк',
            paymentPurpose: 'Оплата за 3D-друк, замовлення №',
            edrpou: '1234567890',
          },
        ]);
      }
    } catch (err) {
      console.error('Помилка завантаження реквізитів', err);
      setPaymentDetails([
        {
          recipientName: 'ФОП Комарницький Юрій',
          iban: 'UA123456789012345678901234567',
          bankName: 'Монобанк',
          paymentPurpose: 'Оплата за 3D-друк, замовлення №',
          edrpou: '1234567890',
        },
      ]);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchPaymentDetails();
  }, []);

  // ===== ВАЛІДАЦІЯ =====
  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; city?: string; warehouse?: string } = {};

    if (!orderForm.name.trim()) {
      newErrors.name = 'Будь ласка, введіть ваше ім\'я';
    }
    if (!orderForm.phone.trim()) {
      newErrors.phone = 'Будь ласка, введіть номер телефону';
    }
    if (delivery.deliveryType !== 'pickup') {
      if (!delivery.city.trim()) {
        newErrors.city = 'Введіть місто доставки';
      }
      if (!delivery.warehouse.trim()) {
        newErrors.warehouse = 'Введіть відділення доставки';
      }
    }
    if (!paymentConfirmed) {
      alert('Будь ласка, підтвердіть оплату перед оформленням замовлення');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] pt-32 pb-20 container-custom flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-heading font-bold text-[#1a3c34] mb-4">Кошик порожній</h1>
          <p className="text-gray-500 mb-8">Додайте товари з галереї або сторінки послуг.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/gallery" className="px-6 py-3 bg-[#1a3c34] text-white rounded-full font-medium hover:bg-[#2d5a4b] transition">
              Перейти до галереї
            </Link>
            <Link href="/services" className="px-6 py-3 border-2 border-[#c9a84c] text-[#c9a84c] rounded-full font-medium hover:bg-[#c9a84c] hover:text-white transition">
              Перейти до послуг
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      updateQuantity(id, newQty);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (newPrice: number, newOptions: Record<string, any>, newValues: Record<string, any>) => {
    if (editingItem) {
      updateItem(editingItem.id, {
        price: newPrice,
        options: newOptions,
        calculatorData: {
          ...editingItem.calculatorData,
          values: newValues,
        },
      });
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstError as HTMLElement).focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: orderForm.name,
            phone: orderForm.phone,
            email: orderForm.email || '',
            comment: orderForm.comment,
          },
          delivery: {
            type: delivery.deliveryType,
            city: delivery.city,
            warehouse: delivery.warehouse,
          },
          items: items.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            options: item.options || {},
            category: item.category,
          })),
          total: total,
          source: 'cart',
          payment: {
            confirmed: paymentConfirmed,
            number: paymentNumber || '',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const orderData = {
          id: data.id || `ORDER-${Date.now()}`,
          customer: {
            name: orderForm.name,
            phone: orderForm.phone,
            email: orderForm.email || '',
            comment: orderForm.comment,
          },
          delivery: {
            type: delivery.deliveryType,
            city: delivery.city,
            warehouse: delivery.warehouse,
          },
          items: items.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            options: item.options || {},
            category: item.category,
          })),
          total: total,
          created_at: new Date().toISOString(),
        };
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        clearCart();
        router.push('/order-confirmation');
      } else {
        const data = await res.json();
        alert(`❌ ${data.error || 'Помилка при оформленні замовлення'}`);
      }
    } catch (e) {
      alert('❌ Помилка з\'єднання. Перевірте інтернет.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getItemImage = (item: any) => {
    if (item.icon && typeof item.icon === 'string' && item.icon.startsWith('http')) {
      return { type: 'url', value: item.icon };
    }
    if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
      return { type: 'url', value: item.image };
    }
    if (item.icon && typeof item.icon === 'string' && !item.icon.startsWith('http')) {
      return { type: 'emoji', value: item.icon };
    }
    if (item.image && typeof item.image === 'string' && !item.image.startsWith('http')) {
      return { type: 'local', value: item.image };
    }
    return { type: 'emoji', value: '📦' };
  };

  return (
    <div className="pt-32 pb-20 container-custom max-w-7xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-[#1a3c34] mb-8 flex items-center gap-3">
        <span>Кошик</span>
        <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
          {totalItems} товарів
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ЛІВА КОЛОНКА – ТОВАРИ */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <h3 className="font-bold text-[#1a3c34] text-lg">Ваші товари</h3>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Очистити
              </button>
            </div>

            {items.map((item) => {
              const imageInfo = getItemImage(item);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm flex items-center justify-center text-4xl">
                    {imageInfo.type === 'emoji' ? (
                      <span className="text-5xl">{imageInfo.value}</span>
                    ) : imageInfo.type === 'url' ? (
                      <img
                        src={imageInfo.value}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('span');
                            fallback.className = 'text-5xl';
                            fallback.textContent = '📦';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <Image
                        src={imageInfo.value}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('span');
                            fallback.className = 'text-5xl';
                            fallback.textContent = '📦';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1a3c34]">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.options).map(([key, val]) => (
                          <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-bold text-[#1a3c34]">
                        {item.price === 0 ? 'Безкоштовно' : `${item.price} ₴`}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-red-500 line-through">{item.originalPrice} ₴</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 rounded-full hover:bg-gray-200 transition flex items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {item.calculatorData && (
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-500 hover:text-blue-700 transition p-1 text-xs"
                          title="Редагувати параметри"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {hasConsultationOrVolunteer && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                <p className="font-medium">📌 Для замовлень консультацій та волонтерської допомоги</p>
                <p>Рекомендуємо обирати самовивіз. Ми зв'яжемося з вами для узгодження деталей.</p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Загальна сума</p>
                <p className="text-2xl font-bold text-[#1a3c34]">{total} ₴</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = '/services'}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition"
                >
                  + Додати товари
                </button>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-800">Акція!</p>
                <p className="text-sm text-green-700">При замовленні від 10 одиниць – знижка 5%.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА – ОФОРМЛЕННЯ ЗАМОВЛЕННЯ */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-32 space-y-5">
            <h3 className="text-xl font-bold text-[#1a3c34] border-b border-gray-200 pb-4">
              Оформлення замовлення
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товарів:</span>
                <span className="font-medium">{totalItems} шт.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Сума:</span>
                <span className="font-bold text-[#1a3c34]">{total} ₴</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                <span className="text-gray-600">До сплати:</span>
                <span className="font-bold text-xl text-[#1a3c34]">{total} ₴</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я *</label>
              <input
                type="text"
                value={orderForm.name}
                onChange={(e) => {
                  setOrderForm({ ...orderForm, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Іван Петренко"
                className={`w-full p-3 bg-gray-50 rounded-xl border ${
                  errors.name ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input
                type="tel"
                value={orderForm.phone}
                onChange={(e) => {
                  setOrderForm({ ...orderForm, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="+38 098 0751707"
                className={`w-full p-3 bg-gray-50 rounded-xl border ${
                  errors.phone ? 'border-red-500 ring-2 ring-red-500/30' : 'border-gray-200'
                } focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (необов'язково)</label>
              <input
                type="email"
                value={orderForm.email}
                onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                placeholder="ivan@example.com"
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Коментар</label>
              <textarea
                value={orderForm.comment}
                onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                placeholder="Додаткові побажання..."
                rows={2}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Доставка</label>
              <DeliverySelector
                value={delivery}
                onChange={(val) => {
                  setDelivery(val);
                  if (errors.city || errors.warehouse) {
                    setErrors({ ...errors, city: undefined, warehouse: undefined });
                  }
                }}
              />
              {delivery.deliveryType !== 'pickup' && (
                <div className="mt-2">
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                  {errors.warehouse && (
                    <p className="text-red-500 text-sm mt-1">{errors.warehouse}</p>
                  )}
                </div>
              )}
            </div>

            {/* ===== БЛОК ОПЛАТИ ===== */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-4 space-y-3 shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💳</span>
                <div>
                  <h4 className="font-bold text-amber-900 text-lg">Оплата замовлення</h4>
                  <p className="text-amber-800 text-sm">
                    Підтвердіть оплату для завершення оформлення
                  </p>
                </div>
              </div>

              {/* ===== ЗМЕНШЕНА КНОПКА РЕКВІЗИТІВ ===== */}
              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-[#c9a84c] to-[#b89a3e] shadow-md shadow-[#c9a84c]/30 hover:shadow-[#c9a84c]/50 hover:scale-[1.02] transition-all duration-200 text-base flex items-center justify-center gap-2"
              >
                <span className="text-xl">📋</span>
                Показати реквізити для оплати
              </button>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="paymentConfirmCart"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                  className="w-5 h-5 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
                />
                <label htmlFor="paymentConfirmCart" className="text-sm font-medium text-gray-700">
                  Я підтверджую оплату
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер платежу (необов'язково)
                </label>
                <input
                  type="text"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  placeholder="Наприклад: 1234567890"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !paymentConfirmed}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-base transition-all duration-300 shadow-lg ${
                isSubmitting || !paymentConfirmed
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#1a3c34] hover:bg-[#2d5a4b] shadow-[#1a3c34]/30 hover:shadow-[#1a3c34]/50'
              }`}
            >
              {isSubmitting ? 'Обробка...' : paymentConfirmed ? 'Оформити замовлення' : 'Підтвердіть оплату'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Натискаючи "Оформити замовлення", ви погоджуєтесь з <br />
              <a href="/terms" className="text-[#c9a84c] hover:underline">умовами використання</a>
            </p>
          </div>
        </div>
      </div>

      <EditModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* ===== МОДАЛКА РЕКВІЗИТИ ===== */}
      {showPaymentModal && paymentDetails.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a3c34] flex items-center gap-2">
                <span className="text-2xl">💳</span> Реквізити для оплати
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl transition">
                ✕
              </button>
            </div>
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-96 overflow-y-auto">
              {paymentDetails.map((detail, idx) => (
                <div key={idx} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[#c9a84c]">#{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-600">{detail.bankName}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Отримувач</p>
                    <p className="font-medium text-gray-800">{detail.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IBAN</p>
                    <p className="font-mono font-bold text-sm text-[#1a3c34] break-all">{detail.iban}</p>
                  </div>
                  {detail.edrpou && (
                    <div>
                      <p className="text-xs text-gray-500">ЄДРПОУ / РНОКПП</p>
                      <p className="font-medium text-gray-800">{detail.edrpou}</p>
                    </div>
                  )}
                  {detail.paymentPurpose && (
                    <div>
                      <p className="text-xs text-gray-500">Призначення платежу</p>
                      <p className="font-medium text-gray-800">{detail.paymentPurpose}</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ Після оплати вкажіть номер платежу в полі вище та підтвердіть оплату.
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 w-full py-2 bg-[#1a3c34] text-white rounded-lg font-medium hover:bg-[#2d5a4b] transition"
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}