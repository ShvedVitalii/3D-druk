'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditAbout3D() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState({
    title: 'Все про 3D-друк',
    text: 'Тут буде корисна інформація про 3D-друк, матеріали, технології, поради та багато іншого. Цей текст можна редагувати в адмін-панелі.'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const item = items.find((i: any) => i.key === 'about_3d');
      if (item?.data) {
        setContent(item.data);
      }
    } catch (err) {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'about_3d', data: content }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">📖 Все про 3D-друк</h1>
        <button onClick={() => router.push('/admin')} className="text-sm text-gray-500 hover:text-[#1a3c34] transition">
          ← На головну
        </button>
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст (можна використовувати переноси рядків)</label>
            <textarea
              value={content.text}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
              rows={8}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✅ Збережено!</p>}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => router.push('/admin')} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
              Скасувати
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50">
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}