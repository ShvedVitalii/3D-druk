'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const blockNames: Record<string, string> = {
  hero: 'Головний банер',
  features: 'Чому обирають нас?',
  materials: 'Матеріали',
  process: 'Як ми працюємо',
  pricing: 'Вартість та доставка',
  testimonials: 'Відгуки',
  faq: 'Часті запитання',
  finalCTA: 'Готові втілити ідею?',
  gallery: 'Наші роботи',
};

// Мапа кастомних редакторів для блоків зі складною структурою
const customEditors: Record<string, string> = {
  pricing: '/admin/content/pricing',
  gallery: '/admin/content/gallery',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      console.error('Помилка входу:', error);
      alert(`Помилка входу: ${error}. Перевірте консоль.`);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchBlocks();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchBlocks = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Виключаємо зайві ключі, які не потрібно показувати на головній адмінці
      const excludeKeys = ['services', 'printers', 'contacts', 'catalog', 'payment_details'];
      const filtered = data.filter((item: any) => !excludeKeys.includes(item.key));
      setBlocks(filtered);
    } catch (err) {
      console.error('Помилка завантаження блоків:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Завантаження...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-200">
          <h1 className="text-3xl font-bold text-[#1a3c34] mb-4">Вхід в адмін-панель</h1>
          <p className="text-gray-500 mb-6">Доступ тільки для адміністратора</p>
          <button
            onClick={() => signIn('google', { callbackUrl: '/admin' })}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-300 rounded-xl hover:shadow-md transition shadow-sm text-gray-700 font-medium"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Увійти через Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center text-gray-500">Завантаження блоків...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a3c34]">Управління контентом головної сторінки</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Вийти
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {blocks.map((item) => {
            const data = item.data || {};
            const name = blockNames[item.key] || item.key;
            const editHref = customEditors[item.key] || `/admin/content/${item.key}`;
            return (
              <div key={item.key} className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-[#1a3c34]">{name}</h2>
                  <Link
                    href={editHref}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    Редагувати
                  </Link>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {typeof data === 'object' && !Array.isArray(data) && data !== null ? (
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(data).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <span className="font-medium">{k}:</span>
                          <span>{typeof v === 'string' ? v : JSON.stringify(v).slice(0, 50)}</span>
                        </div>
                      ))}
                      {Object.keys(data).length > 4 && <div className="col-span-2 text-gray-400">...</div>}
                    </div>
                  ) : Array.isArray(data) ? (
                    <div>
                      {data.slice(0, 3).map((el, idx) => (
                        <div key={idx} className="border-b border-gray-100 py-1">
                          {typeof el === 'object' ? (
                            <span>{el.title || el.name || `Елемент ${idx + 1}`}</span>
                          ) : (
                            <span>{String(el)}</span>
                          )}
                        </div>
                      ))}
                      {data.length > 3 && <div className="text-gray-400">... ще {data.length - 3} елементів</div>}
                    </div>
                  ) : (
                    <div>{String(data)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}