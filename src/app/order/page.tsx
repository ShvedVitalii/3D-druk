'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/forms/FileUpload';
import CalculatorModal from '@/components/order/CalculatorModal';
import DeliverySelector from '@/components/order/DeliverySelector';
import STLViewer from '@/components/order/STLViewer';

const designPrices = [
  { label: 'Концепція виробу', price: '500–2 000 грн' },
  { label: 'Проста 3D-модель', price: '2 000–5 000 грн' },
  { label: 'Авторський сувенір', price: '5 000–15 000 грн' },
  { label: 'Художня модель', price: '15 000–40 000 грн' },
  { label: 'Підготовка до кольорового друку AMS', price: '+20–40%' },
  { label: 'Передача виключних авторських прав', price: '+50–200% до вартості моделі' },
];

const materialPrices: Record<string, number> = {
  PLA: 5,
  PETG: 10,
  ABS: 5,
  ASA: 12,
  TPU: 8,
  'PA (нейлон)': 20,
};

const infillFactor = 0.01;
const perimeterFactor = 0.02;
const layerHeightFactor = 0.005;

const getRecommendedInfill = (data: any) => {
  const volume = data.volume;
  const dims = data.dimensions;
  const maxDim = Math.max(dims.width, dims.height, dims.depth);
  if (volume > 500) return 10;
  if (volume > 100) return 20;
  if (volume > 50) return 30;
  if (maxDim < 3) return 40;
  if (data.triangleCount > 200000) return 15;
  return 20;
};

const getRecommendedPerimeters = (data: any) => {
  const volume = data.volume;
  if (volume > 500) return 3;
  if (volume > 100) return 2;
  return 2;
};

const getRecommendedLayerHeight = (data: any) => {
  const triangleCount = data.triangleCount;
  if (triangleCount > 150000) return 0.1;
  if (triangleCount > 50000) return 0.15;
  return 0.2;
};

export default function OrderPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    delivery: 'nova' as 'nova' | 'ukr' | 'pickup',
    city: '',
    warehouse: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [calcOpen, setCalcOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<typeof form | null>(null);

  const [material, setMaterial] = useState('PLA');
  const [weight, setWeight] = useState(50);
  const [infill, setInfill] = useState(20);
  const [perimeters, setPerimeters] = useState(2);
  const [layerHeight, setLayerHeight] = useState(0.2);

  const [modelInfo, setModelInfo] = useState<any>(null);
  const [autoDetected, setAutoDetected] = useState(false);
  const loadedRef = useRef(false);

  const basePrice = materialPrices[material] || 5;
  const complexityFactor = 1 + (infill / 100) * infillFactor + perimeters * perimeterFactor + (0.2 / layerHeight) * layerHeightFactor;
  const totalPrice = Math.round(basePrice * weight * complexityFactor * 100) / 100;

  const handleModelLoaded = (data: any) => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    console.log('📊 Дані моделі:', data);
    setModelInfo(data);
    setAutoDetected(true);

    const estimatedWeight = Math.round(data.volume * 1.24 * 10) / 10;
    setWeight(Math.max(1, estimatedWeight || 50));
    setInfill(getRecommendedInfill(data));
    setPerimeters(getRecommendedPerimeters(data));
    setLayerHeight(getRecommendedLayerHeight(data));

    setStatus('✅ Параметри автоматично підібрано на основі моделі!');
    setTimeout(() => setStatus(''), 5000);
  };

  const handleFileSelect = (file: File | null) => {
    setFile(file);
    if (!file) {
      setModelInfo(null);
      setAutoDetected(false);
      loadedRef.current = false;
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file) {
    setStatus('Будь ласка, завантажте файл моделі або зображення');
    return;
  }
  if (form.delivery !== 'pickup' && (!form.city.trim() || !form.warehouse.trim())) {
    setStatus('Будь ласка, введіть місто та відділення');
    return;
  }
  
  setStatus('Надсилання...');

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email || '',
          comment: form.description,
        },
        delivery: {
          type: form.delivery,
          city: form.city,
          warehouse: form.warehouse,
        },
        items: [
          {
            title: '3D-друк на замовлення',
            material,
            weight,
            infill,
            perimeters,
            layerHeight,
            file: file?.name || '',
            totalPrice: totalPrice,
          },
        ],
        total: totalPrice,
        source: 'form',
      }),
    });

    if (res.ok) {
      setStatus('');
      setShowSuccess(true);
      setForm({ name: '', phone: '', email: '', delivery: 'nova', city: '', warehouse: '', description: '' });
      setFile(null);
      setModelInfo(null);
      setAutoDetected(false);
      loadedRef.current = false;
    } else {
      const data = await res.json();
      setStatus(`❌ ${data.error || 'Помилка при надсиланні замовлення'}`);
    }
  } catch (e) {
    setStatus('❌ Помилка з\'єднання. Перевірте інтернет.');
  }
};

  return (
    <div className="pt-32 pb-20 container-custom max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-[#1a3c34] mb-4 font-heading text-4xl">Замовити 3D-друк</h1>
        <p className="text-gray-600 text-lg">Заповніть форму, завантажте файл і ми розрахуємо вартість</p>
        <button onClick={() => setCalcOpen(true)} className="mt-4 text-[#c9a84c] font-semibold underline hover:no-underline">
          Попередньо розрахувати вартість →
        </button>
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">
          📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см (об'єм ~16,8 л)
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваше ім’я *</label>
              <input
                type="text"
                placeholder="Іван Петренко"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
              <input
                type="tel"
                placeholder="+38 098 0751707"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (необов'язково)</label>
            <input
              type="email"
              placeholder="ivan@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Спосіб доставки</label>
            <DeliverySelector
              value={{
                city: form.city,
                warehouse: form.warehouse,
                deliveryType: form.delivery,
              }}
              onChange={(val) => setForm({
                ...form,
                city: val.city,
                warehouse: val.warehouse,
                delivery: val.deliveryType,
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис замовлення</label>
            <textarea
              placeholder="Вкажіть розміри, бажаний матеріал, колір, кількість..."
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-semibold text-[#1a3c34] flex items-center gap-2">
              Параметри друку
              {autoDetected && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  🎯 Авто
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Матеріал</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                >
                  {Object.keys(materialPrices).map((m) => (
                    <option key={m} value={m}>{m} ({materialPrices[m]} ₴/г)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Вага (г)
                  {autoDetected && <span className="text-xs text-green-600 ml-1">*</span>}
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
                {autoDetected && modelInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    Оцінено з моделі: ~{(modelInfo.volume * 1.24).toFixed(1)} г
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Заповнення (%)
                  {autoDetected && <span className="text-xs text-green-600 ml-1">*</span>}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={infill}
                  onChange={(e) => setInfill(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{infill}%</span>
                  {autoDetected && modelInfo && (
                    <span className="text-green-600">рекомендовано: {getRecommendedInfill(modelInfo)}%</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Периметри
                  {autoDetected && <span className="text-xs text-green-600 ml-1">*</span>}
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={perimeters}
                  onChange={(e) => setPerimeters(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{perimeters}</span>
                  {autoDetected && modelInfo && (
                    <span className="text-green-600">рекомендовано: {getRecommendedPerimeters(modelInfo)}</span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Висота шару (мм)
                  {autoDetected && <span className="text-xs text-green-600 ml-1">*</span>}
                </label>
                <select
                  value={layerHeight}
                  onChange={(e) => setLayerHeight(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                >
                  <option value={0.05}>0.05 (дуже висока точність)</option>
                  <option value={0.1}>0.1 (висока)</option>
                  <option value={0.15}>0.15 (середня)</option>
                  <option value={0.2}>0.2 (стандарт)</option>
                  <option value={0.3}>0.3 (швидкий)</option>
                </select>
                {autoDetected && modelInfo && (
                  <p className="text-xs text-green-600 mt-1">
                    рекомендовано: {getRecommendedLayerHeight(modelInfo)} мм
                  </p>
                )}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
              <p className="text-sm text-gray-600">Орієнтовна вартість:</p>
              <p className="text-2xl font-bold text-[#1a3c34]">{totalPrice.toFixed(2)} ₴</p>
              <p className="text-xs text-gray-500">* Розрахунок приблизний, остаточна ціна після узгодження</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Файл моделі або фото *</label>
            <FileUpload onFileSelect={handleFileSelect} />
            {file && <p className="text-[#1a3c34] text-sm mt-2">✅ Вибрано: {file.name}</p>}
          </div>

          {file && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Попередній перегляд моделі</label>
              <STLViewer file={file} onModelLoaded={handleModelLoaded} />
              {modelInfo && (
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div>Об'єм: {modelInfo.volume.toFixed(2)} см³</div>
                  <div>Розміри: {modelInfo.dimensions.width.toFixed(1)}×{modelInfo.dimensions.height.toFixed(1)}×{modelInfo.dimensions.depth.toFixed(1)} см</div>
                  <div>Трикутників: {modelInfo.triangleCount.toLocaleString()}</div>
                </div>
              )}
            </div>
          )}

          <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-sm text-red-700">
            ⚠️ Повернення браку можливе при наявності відеофіксації несправності при розпаковці.
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg shadow-lg shadow-[#1a3c34]/20">
            Надіслати заявку
          </Button>
          {status && <p className={`text-center font-medium ${status.includes('✅') ? 'text-green-600' : 'text-[#1a3c34]'}`}>{status}</p>}
        </form>
      </div>

      <CalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} />

      <AnimatePresence>
        {showSuccess && lastOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7ec8a3]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#c9a84c]/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-[#7ec8a3] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#7ec8a3]/30 animate-float">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-heading font-bold text-[#1a3c34] mb-2">Дякуємо!</h3>
                <p className="text-gray-600 text-lg mb-2">Ваше замовлення прийнято.</p>
                <p className="text-gray-500 text-sm mb-6">Ми зв’яжемося з вами протягом 12 годин.</p>

                <div className="flex flex-col gap-2 mb-6 text-left bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Ім’я:</span>
                    <span className="font-medium text-gray-700">{lastOrder.name || '—'}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Телефон:</span>
                    <span className="font-medium text-gray-700">{lastOrder.phone || '—'}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex justify-between">
                    <span>Доставка:</span>
                    <span className="font-medium text-gray-700">
                      {lastOrder.delivery === 'nova' ? 'Нова Пошта' : lastOrder.delivery === 'ukr' ? 'Укрпошта' : 'Самовивіз'}
                    </span>
                  </p>
                  {(lastOrder.city || lastOrder.warehouse) && (
                    <>
                      <p className="text-sm text-gray-500 flex justify-between">
                        <span>Місто:</span>
                        <span className="font-medium text-gray-700">{lastOrder.city || '—'}</span>
                      </p>
                      <p className="text-sm text-gray-500 flex justify-between">
                        <span>Відділення:</span>
                        <span className="font-medium text-gray-700">{lastOrder.warehouse || '—'}</span>
                      </p>
                    </>
                  )}
                  {lastOrder.description && (
                    <p className="text-sm text-gray-500 flex justify-between">
                      <span>Опис:</span>
                      <span className="font-medium text-gray-700 truncate max-w-[150px]">{lastOrder.description}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="btn-primary w-full py-3 text-center"
                >
                  Зрозуміло
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}