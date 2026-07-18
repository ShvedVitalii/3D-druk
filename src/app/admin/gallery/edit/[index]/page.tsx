'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type GalleryItem = {
  src: string;
  title: string;
  category: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  hidden?: boolean;
};

export default function EditGalleryItem() {
  const params = useParams();
  const index = parseInt(params.index as string);
  const router = useRouter();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItem();
  }, [index]);

  const fetchItem = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const galleryItem = data.find((item: any) => item.key === 'gallery');
      const items = galleryItem?.data || [];
      if (index >= 0 && index < items.length) {
        setItem(items[index]);
      } else {
        setError('Елемент не знайдено');
      }
    } catch (err) {
      setError('Не вдалося завантажити елемент');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setItem(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      const galleryItem = data.find((item: any) => item.key === 'gallery');
      const items = galleryItem?.data || [];
      items[index] = item;
      
      const updateRes = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'gallery', data: items }),
      });
      if (!updateRes.ok) throw new Error('Failed to save');
      router.push('/admin/gallery');
    } catch (err) {
      setError('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!item) return <div className="text-center py-10">Елемент не знайдено</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a3c34]">Редагування: {item.title}</h1>
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
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
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
          <label className="block text-sm font-medium text-gray-700">Знижка (%)</label>
          <input
            type="number"
            value={item.discount || 0}
            onChange={(e) => handleChange('discount', parseFloat(e.target.value))}
            min="0"
            max="100"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Стара ціна (грн)</label>
          <input
            type="number"
            value={item.originalPrice || 0}
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
            disabled={saving}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </div>
  );
}