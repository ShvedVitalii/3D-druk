'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type GalleryItem = {
  src: string;
  title: string;
  category: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  hidden?: boolean;
};

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const galleryItem = data.find((item: any) => item.key === 'gallery');
      setItems(galleryItem?.data || []);
    } catch (err) {
      setError('Не вдалося завантажити каталог');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (index: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей елемент?')) return;
    try {
      const newItems = [...items];
      newItems.splice(index, 1);
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'gallery', data: newItems }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setItems(newItems);
      router.refresh();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  const toggleHidden = async (index: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], hidden: !newItems[index].hidden };
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'gallery', data: newItems }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setItems(newItems);
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Управління каталогом</h1>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
        >
          + Додати фото
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Фото</th>
                <th className="text-left p-4 font-semibold text-gray-600">Назва</th>
                <th className="text-left p-4 font-semibold text-gray-600">Категорія</th>
                <th className="text-left p-4 font-semibold text-gray-600">Ціна</th>
                <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
                <th className="text-right p-4 font-semibold text-gray-600">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-[#1a3c34]">{item.title}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">
                    {item.discount ? (
                      <div>
                        <span className="font-bold text-[#1a3c34]">
                          {Math.round(item.price * (1 - item.discount / 100))} ₴
                        </span>
                        <span className="text-xs text-red-500 line-through ml-2">
                          {item.price} ₴
                        </span>
                      </div>
                    ) : (
                      <span>{item.price} ₴</span>
                    )}
                  </td>
                  <td className="p-4">
                    {item.hidden ? (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Сховано</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Видимо</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleHidden(index)}
                      className={`px-3 py-1 text-xs rounded-lg transition ${
                        item.hidden
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item.hidden ? 'Показати' : 'Сховати'}
                    </button>
                    <Link
                      href={`/admin/gallery/edit/${index}`}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => deleteItem(index)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Фото поки немає. Натисніть "Додати фото".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}