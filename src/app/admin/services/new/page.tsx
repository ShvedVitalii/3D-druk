'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateDiscount, calculateOldPrice, calculateNewPrice } from '@/lib/priceUtils';

export default function NewService() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState({
    id: Date.now(),
    title: '',
    description: '',
    emoji: '🛠️',
    category: 'Друк',
    categoryColor: '#22c55e',
    price: 'від 0 грн',
    priceValue: 0,
    oldPriceValue: 0,
    discount: 0,
    unit: '₴',
    hasCalculator: false,
    hasFileUpload: true,
    additionalInfoLabel: '',
    calculatorFields: [],
    longDesc: '',
    hidden: false,
  });

  // Автоматичний розрахунок при зміні ціни, старої ціни або знижки
  useEffect(() => {
    const { priceValue, oldPriceValue, discount } = service;
    if (priceValue > 0 && oldPriceValue > 0 && oldPriceValue > priceValue) {
      const newDiscount = calculateDiscount(oldPriceValue, priceValue);
      if (newDiscount !== discount) {
        setService(prev => ({ ...prev, discount: newDiscount }));
      }
    }
  }, [service.priceValue, service.oldPriceValue]);

  const handleChange = (field: string, value: any) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: 'priceValue' | 'oldPriceValue' | 'discount', value: number) => {
    setService(prev => {
      const newState = { ...prev, [field]: value };
      // Якщо змінюється ціна або стара ціна – перераховуємо знижку
      if (field === 'priceValue' && newState.oldPriceValue > 0 && newState.oldPriceValue > newState.priceValue) {
        newState.discount = calculateDiscount(newState.oldPriceValue, newState.priceValue);
      }
      // Якщо змінюється стара ціна – перераховуємо знижку
      if (field === 'oldPriceValue' && newState.oldPriceValue > 0 && newState.oldPriceValue > newState.priceValue) {
        newState.discount = calculateDiscount(newState.oldPriceValue, newState.priceValue);
      }
      // Якщо змінюється знижка – перераховуємо стару ціну (якщо ціна > 0)
      if (field === 'discount' && newState.discount > 0 && newState.discount < 100 && newState.priceValue > 0) {
        newState.oldPriceValue = calculateOldPrice(newState.priceValue, newState.discount);
      }
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content');
      const items = await res.json();
      const serviceItem = items.find((item: any) => item.key === 'services');
      const currentServices = serviceItem?.data || [];
      
      // Формуємо price з текстовим відображенням
      const priceText = service.priceValue > 0 
        ? `${service.priceValue} ${service.unit}`
        : 'Договірна';
      
      const newService = {
        ...service,
        price: priceText,
      };
      
      const newServices = [...currentServices, newService];
      
      const updateRes = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'services', data: newServices }),
      });
      if (!updateRes.ok) throw new Error('Failed to save');
      router.push('/admin/services');
    } catch (err) {
      setError('Помилка створення послуги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a3c34]">Додати нову послугу</h1>
        <button
          onClick={() => router.push('/admin/services')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← Назад до списку
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Назва</label>
          <input
            type="text"
            value={service.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Опис (короткий)</label>
          <input
            type="text"
            value={service.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Emoji</label>
          <input
            type="text"
            value={service.emoji}
            onChange={(e) => handleChange('emoji', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Категорія</label>
          <input
            type="text"
            value={service.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Колір категорії (hex)</label>
          <input
            type="text"
            value={service.categoryColor}
            onChange={(e) => handleChange('categoryColor', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ціна (число)</label>
            <input
              type="number"
              value={service.priceValue}
              onChange={(e) => handlePriceChange('priceValue', parseFloat(e.target.value) || 0)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Стара ціна</label>
            <input
              type="number"
              value={service.oldPriceValue || 0}
              onChange={(e) => handlePriceChange('oldPriceValue', parseFloat(e.target.value) || 0)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Знижка (%)</label>
            <input
              type="number"
              value={service.discount || 0}
              onChange={(e) => handlePriceChange('discount', parseFloat(e.target.value) || 0)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              min="0"
              max="100"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Одиниця виміру (напр. ₴, грн/г)</label>
          <input
            type="text"
            value={service.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Детальний опис</label>
          <textarea
            rows={4}
            value={service.longDesc}
            onChange={(e) => handleChange('longDesc', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={service.hasCalculator}
              onChange={(e) => handleChange('hasCalculator', e.target.checked)}
              className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
            />
            Має калькулятор
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={service.hasFileUpload}
              onChange={(e) => handleChange('hasFileUpload', e.target.checked)}
              className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
            />
            Має завантаження файлів
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {loading ? 'Збереження...' : 'Створити'}
          </button>
        </div>
      </form>
    </div>
  );
}