'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
};

type Product = {
  id: string;
  categoryId: string;
};

export default function AdminCatalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      // Переконуємося, що всі категорії мають поле order
      const cats = (data.categories || []).map((c: any) => ({
        ...c,
        order: c.order !== undefined ? c.order : 0,
      }));
      setCategories(cats);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Помилка завантаження категорій:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю категорію разом з усіма товарами?')) return;
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const newCategories = data.categories.filter((c: any) => c.id !== id);
      const newProducts = data.products.filter((p: any) => p.categoryId !== id);
      
      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories, products: newProducts }),
      });
      
      setCategories(newCategories);
      setProducts(newProducts);
      router.refresh();
    } catch (err) {
      alert('Помилка видалення категорії');
    }
  };

  // Функція для оновлення порядку категорій
  const updateCategoryOrder = async (id: string, newOrder: number) => {
    if (isNaN(newOrder) || newOrder < 1) {
      alert('Порядок має бути числом більше 0');
      return;
    }

    // Оновлюємо локальний стан
    let updatedCategories = categories.map(c => 
      c.id === id ? { ...c, order: newOrder } : c
    );

    // Сортуємо за порядком і перенумеровуємо послідовно
    updatedCategories.sort((a, b) => (a.order || 0) - (b.order || 0));
    updatedCategories = updatedCategories.map((c, index) => ({
      ...c,
      order: index + 1,
    }));

    setCategories(updatedCategories);
    setSaving(true);

    try {
      // Отримуємо поточні товари (вони не змінюються)
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      
      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories: updatedCategories, 
          products: data.products || [] 
        }),
      });
      
      router.refresh();
    } catch (err) {
      alert('Помилка збереження порядку');
      // Відновлюємо старі дані
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;

  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  // Сортуємо категорії для відображення
  const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Категорії каталогу</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/catalog/new"
            className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
          >
            + Додати категорію
          </Link>
          <Link
            href="/admin/content/external-links"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            🌐 Більше моделей
          </Link>
        </div>
      </div>

      {saving && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          Збереження...
        </div>
      )}

      {sortedCategories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400">Категорій поки немає. Створіть першу!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((cat) => {
            const count = getProductCount(cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative h-48 bg-gray-100">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📁</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#1a3c34]">{cat.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Порядок:</span>
                      <input
                        type="number"
                        min="1"
                        value={cat.order || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateCategoryOrder(cat.id, val);
                          }
                        }}
                        className="w-12 p-1 text-center text-sm border border-gray-300 rounded focus:border-[#c9a84c] outline-none"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Слаг: {cat.slug}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link
                      href={`/admin/catalog/${cat.id}`}
                      className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      Товари ({count})
                    </Link>
                    <Link
                      href={`/admin/catalog/${cat.id}/edit`}
                      className="px-4 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="px-4 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Видалити
                    </button>
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="px-4 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    >
                      Переглянути
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}