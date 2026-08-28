'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

type Product = {
  id: string;
  categoryId: string;
  title: string;
  images: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
  hidden: boolean;
  createdAt: string;
  order: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export default function AdminCategoryProducts() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const cat = data.categories?.find((c: any) => c.id === categoryId);
      setCategory(cat || null);
      // Переконуємося, що всі товари мають поле order
      const filtered = (data.products || [])
        .filter((p: any) => p.categoryId === categoryId)
        .map((p: any) => ({
          ...p,
          order: p.order !== undefined ? p.order : 0,
        }));
      setProducts(filtered);
    } catch (err) {
      console.error('Помилка завантаження:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return;
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const newProducts = data.products.filter((p: any) => p.id !== id);

      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts }),
      });

      setProducts(products.filter((p) => p.id !== id));
      router.refresh();
    } catch (err) {
      alert('Помилка видалення товару');
    }
  };

  const toggleHidden = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const updatedProducts = data.products.map((p: any) =>
        p.id === id ? { ...p, hidden: !p.hidden } : p
      );

      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts }),
      });

      setProducts(products.map((p) => (p.id === id ? { ...p, hidden: !p.hidden } : p)));
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  // Функція для оновлення порядку товарів
  const updateProductOrder = async (id: string, newOrder: number) => {
    if (isNaN(newOrder) || newOrder < 1) {
      alert('Порядок має бути числом більше 0');
      return;
    }

    // Оновлюємо локальний стан
    let updatedProducts = products.map(p => 
      p.id === id ? { ...p, order: newOrder } : p
    );

    // Сортуємо за порядком і перенумеровуємо послідовно
    updatedProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
    updatedProducts = updatedProducts.map((p, index) => ({
      ...p,
      order: index + 1,
    }));

    setProducts(updatedProducts);
    setSaving(true);

    try {
      // Отримуємо поточні категорії (вони не змінюються)
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      
      // Оновлюємо тільки товари, категорії залишаємо як є
      const otherProducts = data.products.filter((p: any) => p.categoryId !== categoryId);
      const allProducts = [...otherProducts, ...updatedProducts];

      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          categories: data.categories || [], 
          products: allProducts 
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
  if (!category) return <div className="text-center py-10 text-red-500">Категорію не знайдено</div>;

  // Сортуємо товари для відображення
  const sortedProducts = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => router.push('/admin/catalog')} className="text-sm text-gray-500 hover:text-[#1a3c34] mb-2 block">
            ← Всі категорії
          </button>
          <h1 className="text-3xl font-bold text-[#1a3c34]">{category.name}</h1>
          <p className="text-gray-500 text-sm">{category.description}</p>
        </div>
        <Link
          href={`/admin/catalog/${categoryId}/new`}
          className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
        >
          + Додати товар
        </Link>
      </div>

      {saving && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
          Збереження порядку...
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400">У цій категорії поки немає товарів. Додайте перший!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Порядок</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Фото</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Назва</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Ціна</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <input
                        type="number"
                        min="1"
                        value={product.order || 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateProductOrder(product.id, val);
                          }
                        }}
                        className="w-14 p-1 text-center text-sm border border-gray-300 rounded focus:border-[#c9a84c] outline-none"
                        disabled={saving}
                      />
                    </td>
                    <td className="p-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.images?.[0] || '/images/placeholder.jpg'}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#1a3c34]">{product.title}</td>
                    <td className="p-4">
                      <span className="font-bold">{product.price} ₴</span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-xs text-red-500 line-through ml-2">{product.oldPrice} ₴</span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.hidden ? (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Сховано</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Видимо</span>
                      )}
                      {!product.inStock && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full ml-1">Немає</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => toggleHidden(product.id)}
                        className={`px-3 py-1 text-xs rounded-lg transition ${
                          product.hidden
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {product.hidden ? 'Показати' : 'Сховати'}
                      </button>
                      <Link
                        href={`/admin/catalog/${categoryId}/edit/${product.id}`}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        Видалити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}