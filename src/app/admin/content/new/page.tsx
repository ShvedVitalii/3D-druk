'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function NewContentBlock() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [type, setType] = useState<'object' | 'array'>('object');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Введіть назву блоку');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const initialData = type === 'array' ? [] : {};
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), data: initialData }),
      });
      if (!res.ok) throw new Error('Не вдалося створити блок');
      router.push(`/admin/content/${key.trim()}`);
    } catch (err) {
      setError('Помилка створення блоку. Можливо, такий ключ вже існує.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold text-[#1a3c34] mb-6">Створення нового блоку</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Назва блоку (ключ) *
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="наприклад: about_us"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Використовуйте латиницю, цифри та підкреслення.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип даних</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'object' | 'array')}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          >
            <option value="object">Об'єкт (наприклад, hero)</option>
            <option value="array">Масив (наприклад, materials)</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {loading ? 'Створення...' : 'Створити'}
          </button>
        </div>
      </form>
    </div>
  );
}