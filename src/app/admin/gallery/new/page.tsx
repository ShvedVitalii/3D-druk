'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGalleryItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState({
    src: '',
    title: '',
    category: 'Іграшки',
    price: 0,
    discount: 0,
    originalPrice: 0,
    hidden: false,
  });

  const handleChange = (field: string, value: any) => {
    setItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      const galleryItem = data.find((item: any) => item.key === 'gallery');
      const currentItems = galleryItem?.data || [];
      
      const newItems = [...currentItems, item];
      
      const updateRes = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'gallery', data: newItems }),
      });
      if (!updateRes.ok) throw new Error('Failed to save');
      router.push('/admin/gallery');
    } catch (err) {
      setError('Помилка створення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a3c34]">Додати фото в каталог</h1>
        <button
          onClick={() => router.push('/admin/gallery')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← Назад до списку
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Шлях до фото</label>
          <input
            type="text"
            value={item.src}
            onChange={(e) => handleChange('src', e.target.value)}
            placeholder="/images/gallery/1.jpg"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Фото має бути в папці public/images/gallery/</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Назва</label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Категорія</label>
          <select
            value={item.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          >
            <option value="Іграшки">Іграшки</option>
            <option value="Прототипи">Прототипи</option>
            <option value="Декор">Декор</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ціна (грн)</label>
          <input
            type="number"
            value={item.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Знижка (%) (необов'язково)</label>
          <input
            type="number"
            value={item.discount}
            onChange={(e) => handleChange('discount', parseFloat(e.target.value))}
            min="0"
            max="100"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Стара ціна (грн) (необов'язково)</label>
          <input
            type="number"
            value={item.originalPrice}
            onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin/gallery')}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {loading ? 'Збереження...' : 'Додати'}
          </button>
        </div>
      </form>
    </div>
  );
}