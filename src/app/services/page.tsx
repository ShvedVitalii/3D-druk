'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

// ==================== ДАНІ ====================
const services = [
  {
    id: 1,
    title: '3D-друк моделей',
    description: 'Друк будь-яких моделей з високою точністю',
    emoji: '🖨️',
    category: 'Друк',
    categoryColor: '#22c55e',
    price: 'від 6 ₴/г',
    priceValue: 6,
    unit: '₴/г',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Матеріал', key: 'material', options: [
        { label: 'PLA', value: 6 },
        { label: 'PETG', value: 7 },
        { label: 'ABS', value: 7 },
        { label: 'ASA', value: 8 },
        { label: 'TPU', value: 10 },
        { label: 'PA (нейлон)', value: 15 },
      ], default: 6 },
      { type: 'range', label: 'Вага моделі (г)', key: 'weight', min: 1, max: 5000, default: 50, step: 1 },
      { type: 'range', label: 'Кількість', key: 'quantity', min: 1, max: 500, default: 1, step: 1 },
    ],
    longDesc: 'Друк будь-яких 3D-моделей з точністю до 0.1 мм. Матеріали: PLA, PETG, ABS, ASA, TPU, PA (нейлон). Розмір до 25,6×25,6×25,6 см. Терміни від 1 дня.',
  },
  {
    id: 2,
    title: '3D-моделювання',
    description: 'Створення 3D-моделей за вашими ескізами',
    emoji: '💻',
    category: 'Дизайн',
    categoryColor: '#3b82f6',
    price: 'від 1 000 ₴',
    priceValue: 1000,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Складність', key: 'complexity', options: [
        { label: 'Проста', value: 1000 },
        { label: 'Середня', value: 2000 },
        { label: 'Складна', value: 4000 },
        { label: 'Дуже складна', value: 7000 },
      ], default: 1000 },
      { type: 'range', label: 'Кількість моделей', key: 'quantity', min: 1, max: 10, default: 1, step: 1 },
    ],
    longDesc: 'Розробляємо 3D-моделі будь-якої складності за вашими ескізами, кресленнями або ідеями. Формати: STL, OBJ, 3MF.',
  },
  {
    id: 3,
    title: 'Дизайн та брендинг',
    description: 'Логотипи, айдентика, візуальний стиль',
    emoji: '🎨',
    category: 'Дизайн',
    categoryColor: '#3b82f6',
    price: 'від 1 500 ₴',
    priceValue: 1500,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Тип роботи', key: 'type', options: [
        { label: 'Логотип', value: 1500 },
        { label: 'Айдентика', value: 4000 },
        { label: 'Упаковка', value: 2500 },
      ], default: 1500 },
      { type: 'range', label: 'Кількість варіантів', key: 'variants', min: 1, max: 5, default: 2, step: 1 },
    ],
    longDesc: 'Створюємо унікальний дизайн для вашого бренду: логотипи, айдентику, упаковку. Допомагаємо виділитися на ринку.',
  },
  {
    id: 4,
    title: 'Постобробка виробів',
    description: 'Шліфування, фарбування, склеювання',
    emoji: '🔧',
    category: 'Обробка',
    categoryColor: '#8b5cf6',
    price: 'від 200 ₴',
    priceValue: 200,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Тип обробки', key: 'type', options: [
        { label: 'Шліфування', value: 200 },
        { label: 'Ґрунтовка', value: 300 },
        { label: 'Фарбування', value: 500 },
      ], default: 200 },
      { type: 'range', label: 'Розмір виробу (см)', key: 'size', min: 1, max: 50, default: 10, step: 1 },
    ],
    longDesc: 'Повний цикл постобробки: шліфування, ґрунтовка, фарбування, склеювання. Ваш виріб виглядатиме як професійний продукт.',
  },
  {
    id: 5,
    title: 'Консультація',
    description: 'Допомога з вибором матеріалу та підготовкою до друку',
    emoji: '💡',
    category: 'Консультації',
    categoryColor: '#f59e0b',
    price: 'безкоштовно',
    priceValue: 0,
    unit: '',
    hasCalculator: false,
    longDesc: 'Проконсультуємо з будь-яких питань 3D-друку. Допоможемо обрати матеріал, оптимізувати модель та підготувати її до друку.',
  },
  {
    id: 6,
    title: 'Прототипування',
    description: 'Швидке створення прототипів для тестування',
    emoji: '⚙️',
    category: 'Друк',
    categoryColor: '#22c55e',
    price: 'від 300 ₴',
    priceValue: 300,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Матеріал', key: 'material', options: [
        { label: 'PLA', value: 6 },
        { label: 'PETG', value: 7 },
        { label: 'ABS', value: 7 },
        { label: 'ASA', value: 8 },
      ], default: 6 },
      { type: 'range', label: 'Вага (г)', key: 'weight', min: 1, max: 5000, default: 50, step: 1 },
    ],
    longDesc: 'Швидке прототипування для тестування форми, функціональності та ергономіки. Терміни від 1 дня.',
  },
  {
    id: 7,
    title: 'Друк для ЗСУ / Волонтерські послуги',
    description: 'Адаптери, кріплення, тактичні аксесуари',
    emoji: '🇺🇦',
    category: 'Соціальне',
    categoryColor: '#ef4444',
    price: 'волонтерська допомога',
    priceValue: 0,
    unit: '',
    hasCalculator: false,
    longDesc: 'На волонтерських засадах друкуємо адаптери, кріплення, тактичні аксесуари, масажери та реабілітаційні прилади для потреб ЗСУ.',
  },
  {
    id: 8,
    title: '3D-сканування',
    description: 'Цифрова копія реального об\'єкта',
    emoji: '📷',
    category: 'Дизайн',
    categoryColor: '#3b82f6',
    price: 'від 800 ₴',
    priceValue: 800,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Точність', key: 'accuracy', options: [
        { label: 'Стандартна', value: 800 },
        { label: 'Висока', value: 1200 },
        { label: 'Максимальна', value: 2000 },
      ], default: 800 },
      { type: 'range', label: 'Розмір об\'єкта (см)', key: 'size', min: 1, max: 100, default: 20, step: 1 },
    ],
    longDesc: 'Створюємо точну 3D-копію вашого об\'єкта. Ідеально для реверс-інжинірингу, архівування або створення дублікатів.',
  },
  {
    id: 9,
    title: 'Механічна обробка',
    description: 'Свердління, нарізання різьби, доведення',
    emoji: '🔩',
    category: 'Обробка',
    categoryColor: '#8b5cf6',
    price: 'від 150 ₴',
    priceValue: 150,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Тип роботи', key: 'type', options: [
        { label: 'Свердління', value: 150 },
        { label: 'Нарізання різьби', value: 200 },
        { label: 'Доведення поверхонь', value: 250 },
      ], default: 150 },
      { type: 'range', label: 'Кількість операцій', key: 'count', min: 1, max: 20, default: 2, step: 1 },
    ],
    longDesc: 'Механічна обробка надрукованих деталей: свердління, нарізання різьби, шліфування, полірування.',
  },
  {
    id: 10,
    title: 'Лазерне гравіювання',
    description: 'Написи, логотипи, малюнки на поверхні',
    emoji: '🔦',
    category: 'Обробка',
    categoryColor: '#8b5cf6',
    price: 'від 100 ₴',
    priceValue: 100,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Матеріал', key: 'material', options: [
        { label: 'Пластик', value: 100 },
        { label: 'Дерево', value: 150 },
        { label: 'Шкіра', value: 200 },
      ], default: 100 },
      { type: 'range', label: 'Площа (см²)', key: 'area', min: 1, max: 100, default: 10, step: 1 },
    ],
    longDesc: 'Наносимо будь-які зображення лазером. Ідеально для персоналізації виробів, сувенірів, брендування.',
  },
  {
    id: 11,
    title: 'Фарбування та покриття',
    description: 'Праймер, акрил, лак, захисні покриття',
    emoji: '🎨',
    category: 'Обробка',
    categoryColor: '#8b5cf6',
    price: 'від 300 ₴',
    priceValue: 300,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Тип покриття', key: 'type', options: [
        { label: 'Праймер', value: 300 },
        { label: 'Фарбування', value: 500 },
        { label: 'Лакування', value: 400 },
      ], default: 300 },
      { type: 'range', label: 'Розмір виробу (см)', key: 'size', min: 1, max: 50, default: 10, step: 1 },
    ],
    longDesc: 'Професійне фарбування та нанесення захисних покриттів. Використовуємо якісні фарби та лаки для довговічності та естетики.',
  },
  {
    id: 12,
    title: 'Освітні проєкти',
    description: 'Макети, молекулярні структури, демонстрації',
    emoji: '📚',
    category: 'Освіта',
    categoryColor: '#14b8a6',
    price: 'від 600 ₴',
    priceValue: 600,
    unit: '₴',
    hasCalculator: true,
    calculatorFields: [
      { type: 'select', label: 'Тип макету', key: 'type', options: [
        { label: 'Навчальний', value: 600 },
        { label: 'Демонстраційний', value: 1000 },
        { label: 'Інтерактивний', value: 1500 },
      ], default: 600 },
      { type: 'range', label: 'Розмір (см)', key: 'size', min: 5, max: 50, default: 15, step: 1 },
    ],
    longDesc: 'Створюємо навчальні макети для шкіл, вишів, медичних установ. Допомагаємо візуалізувати складні концепції.',
  },
];

const categories = ['Всі', 'Друк', 'Дизайн', 'Обробка', 'Консультації', 'Соціальне', 'Освіта'];

// ==================== КОМПОНЕНТ ====================
export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [calculatorValues, setCalculatorValues] = useState<Record<string, any>>({});
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const addItem = useCartStore((state) => state.addItem);

  const filtered = selectedCategory === 'Всі' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  useEffect(() => {
    if (selectedService && selectedService.hasCalculator) {
      calculatePrice(selectedService);
    }
  }, [calculatorValues, selectedService]);

  const handleCalculatorChange = (key: string, value: any) => {
    setCalculatorValues(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrice = (service: typeof services[0]) => {
    if (!service.hasCalculator || !service.calculatorFields) return;
    let basePrice = service.priceValue;
    let weight = 1, quantity = 1;
    service.calculatorFields.forEach(field => {
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
    if (basePrice === 0) basePrice = service.priceValue;
    let total = basePrice * weight * quantity;
    // Застосовуємо знижки для друку (id === 1)
    if (service.id === 1) {
      if (quantity >= 500) {
        total = Math.round(total * 0.85); // індивідуальний договір – умовно 15%
      } else if (quantity >= 100) {
        total = Math.round(total * 0.85); // 15%
      } else if (quantity >= 50) {
        total = Math.round(total * 0.9); // 10%
      } else if (quantity >= 10) {
        total = Math.round(total * 0.95); // 5%
      }
    }
    setCalculatedPrice(total);
  };

  const addToCartWithOptions = (service: typeof services[0]) => {
    if (service.hasCalculator && service.calculatorFields) {
      if (calculatedPrice === null) {
        calculatePrice(service);
        return;
      }
      const options: Record<string, any> = {};
      const values: Record<string, any> = {};
      service.calculatorFields.forEach(field => {
        const val = calculatorValues[field.key] ?? field.default;
        values[field.key] = val;
        if (field.type === 'select' && field.options) {
          const option = field.options.find(o => o.value === val);
          options[field.label] = option ? option.label : val;
        } else {
          options[field.label] = val;
        }
      });

      let basePrice = service.priceValue;
      service.calculatorFields.forEach(field => {
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
        category: service.category,
        icon: service.emoji,
        options,
        originalPrice: Math.round(calculatedPrice * 1.2),
        calculatorData: {
          fields: service.calculatorFields as any, // виправлення TypeScript
          values: values,
          basePrice: basePrice,
        },
      });
      showToastMessage(`✅ ${service.title} додано до кошика!`);
      setCalculatedPrice(null);
      setCalculatorValues({});
      setSelectedService(null);
    } else if (service.priceValue > 0) {
      addItem({
        id: `service-${service.id}-${Date.now()}`,
        title: service.title,
        price: service.priceValue,
        image: '',
        category: service.category,
        icon: service.emoji,
        originalPrice: service.priceValue ? Math.round(service.priceValue * 1.2) : undefined,
      });
      showToastMessage(`✅ ${service.title} додано до кошика!`);
      setSelectedService(null);
    }
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openServiceModal = (service: typeof services[0]) => {
    setSelectedService(service);
    const initialValues: Record<string, any> = {};
    if (service.calculatorFields) {
      service.calculatorFields.forEach(field => {
        initialValues[field.key] = field.default;
      });
    }
    setCalculatorValues(initialValues);
    setCalculatedPrice(null);
  };

  return (
    <div ref={ref} className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 bg-[#1a3c34] text-white px-6 py-4 rounded-xl shadow-2xl border border-[#c9a84c]/30 animate-slide-left max-w-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <p className="font-medium">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="absolute top-2 right-2 text-white/60 hover:text-white">✕</button>
        </div>
      )}

      {/* Заголовок */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">Наші послуги</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">Професійний 3D-друк, дизайн, моделювання та багато іншого</p>
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см</div>
      </motion.div>

      {/* Фільтри */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2.5 mb-12"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-[#1a3c34] text-white shadow-md shadow-[#1a3c34]/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* КАРТКИ */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
            className="group bg-white rounded-2xl border border-gray-100/80 transition-all duration-300 hover:border-gray-200 hover:shadow-xl flex flex-col overflow-hidden"
          >
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
                  </div>
                  <h3 className="text-base font-bold text-[#1a3c34] mt-1.5 leading-snug group-hover:text-[#c9a84c] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="mb-3">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Ціна</span>
                  <span className="text-xl font-bold text-[#1a3c34] tracking-tight">
                    {service.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openServiceModal(service)}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200"
                  >
                    Детальніше
                  </button>
                  {service.priceValue > 0 && (
                    <button
                      onClick={() => {
                        if (service.hasCalculator) {
                          openServiceModal(service);
                        } else {
                          addToCartWithOptions(service);
                        }
                      }}
                      className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                    >
                      <span>🛒</span> Купити
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">Немає послуг у цій категорії</div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 text-sm mb-4">Не знайшли потрібну послугу?</p>
        <button
          onClick={() => window.location.href = '/contacts'}
          className="px-6 py-2.5 rounded-full border-2 border-[#c9a84c] text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c] hover:text-white transition-all duration-300"
        >
          Зв'язатися з нами
        </button>
      </motion.div>

      {/* МОДАЛЬНЕ ВІКНО */}
      <AnimatePresence>
        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedService(null);
              setCalculatorValues({});
              setCalculatedPrice(null);
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
                    {selectedService.emoji}
                  </div>
                  <div>
                    <span 
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: selectedService.categoryColor }}
                    >
                      {selectedService.category}
                    </span>
                    <h2 className="text-2xl font-bold text-[#1a3c34] mt-1">{selectedService.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setCalculatorValues({});
                    setCalculatedPrice(null);
                  }}
                  className="text-gray-400 hover:text-gray-700 text-2xl transition w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 text-base mb-4">{selectedService.longDesc}</p>

                {/* ====== НОВИЙ СУЧАСНИЙ БЛОК ІНФОРМАЦІЇ ДЛЯ ДРУКУ ====== */}
                {selectedService.id === 1 && (
                  <div className="mb-4 space-y-3">
                    {/* Картка знижок */}
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

                    {/* Картка мінімальної вартості моделювання */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                      <span className="text-3xl">⚡</span>
                      <div>
                        <p className="text-sm text-amber-800 font-semibold">Мінімальна вартість 3D-моделювання</p>
                        <p className="text-xl font-bold text-[#1a3c34]">1 000 ₴</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedService.hasCalculator && selectedService.calculatorFields && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4">
                    <h4 className="text-base font-bold text-[#1a3c34] mb-4 flex items-center gap-2">🧮 Розрахунок вартості</h4>
                    <div className="space-y-4">
                      {selectedService.calculatorFields.map((field) => {
                        if (field.type === 'select' && field.options) {
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                              <select
                                value={calculatorValues[field.key] ?? field.default}
                                onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                className="w-full p-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                              >
                                {field.options.map((opt, idx) => (
                                  <option key={opt.label} value={opt.value}>{opt.label} ({opt.value} ₴/г)</option>
                                ))}
                              </select>
                            </div>
                          );
                        } else if (field.type === 'range') {
                          return (
                            <div key={field.key}>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min={field.min}
                                  max={field.max}
                                  step={field.step || 1}
                                  value={calculatorValues[field.key] ?? field.default}
                                  onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                  className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#c9a84c]"
                                />
                                <span className="text-sm font-bold text-[#1a3c34] min-w-[50px] text-center">
                                  {calculatorValues[field.key] ?? field.default}
                                </span>
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
                                min={field.min}
                                max={field.max}
                                step={field.step || 1}
                                value={calculatorValues[field.key] ?? field.default}
                                onChange={(e) => handleCalculatorChange(field.key, Number(e.target.value))}
                                className="w-full p-2.5 bg-white rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition text-sm"
                              />
                              {field.min && field.max && (
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Вартість</p>
                    <p className="text-2xl font-bold text-[#1a3c34]">
                      {calculatedPrice !== null ? `${calculatedPrice} ₴` : selectedService.price}
                    </p>
                  </div>
                  {selectedService.priceValue > 0 && (
                    <button
                      onClick={() => addToCartWithOptions(selectedService)}
                      className="px-8 py-2.5 rounded-xl bg-[#1a3c34] text-white font-bold hover:bg-[#2d5a4b] transition-all duration-300 shadow-md shadow-[#1a3c34]/20 text-base"
                    >
                      Додати в кошик
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}