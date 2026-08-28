'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FileUpload from '@/components/forms/FileUpload';

type Item = {
  id: string;
  name: string;
  logo: string;
  order: number;
};

type Data = {
  description: string;
  items: Item[];
};

export default function EditPartners() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<Data>({
    description: 'Ми співпрацюємо з кращими',
    items: [
      { id: '1', name: 'Партнер 1', logo: '/images/partners/partner1.png', order: 1 },
      { id: '2', name: 'Партнер 2', logo: '/images/partners/partner2.png', order: 2 },
    ],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const response = await res.json();
      const keyItem = response.find((item: any) => item.key === 'partners');
      if (keyItem?.data) {
        if (Array.isArray(keyItem.data)) {
          setData({
            description: 'Ми співпрацюємо з кращими',
            items: keyItem.data,
          });
        } else {
          setData(keyItem.data);
        }
      }
    } catch (err) {
      setError('Не вдалося завантажити дані');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: 'Новий партнер',
      logo: '',
      order: data.items.length + 1,
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цього партнера?')) return;
    setData({ ...data, items: data.items.filter((i) => i.id !== id) });
  };

  const handleChange = (id: string, field: keyof Item, value: any) => {
    setData({
      ...data,
      items: data.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    });
  };

  const handleImageUpload = async (file: File | null, id: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.fileUrl) {
        setData({
          ...data,
          items: data.items.map((i) => (i.id === id ? { ...i, logo: result.fileUrl } : i)),
        });
      }
    } catch (err) {
      alert('Помилка завантаження логотипу');
    } finally {
      setUploading(false);
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
        body: JSON.stringify({ key: 'partners', data }),
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
        <h1 className="text-3xl font-bold text-[#1a3c34]">🤝 Наші партнери</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <input
              type="text"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] outline-none transition"
              placeholder="Наприклад: Ми співпрацюємо з кращими"
            />
          </div>

          <p className="text-sm text-gray-500">Список компаній-партнерів (відображаються на головній)</p>

          {data.items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#1a3c34]">{item.name || 'Без назви'}</h3>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Видалити
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Назва</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                  <input
                    type="number"
                    value={item.order || 0}
                    onChange={(e) => handleChange(item.id, 'order', Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Логотип (круглий)</label>
                  {item.logo && (
                    <div className="mb-2 w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                      <Image src={item.logo} alt={item.name} width={64} height={64} className="object-cover" unoptimized />
                    </div>
                  )}
                  <FileUpload
                    onFileSelect={(file) => handleImageUpload(file, item.id)}
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
                    maxSize={5 * 1024 * 1024}
                    label={item.logo ? 'Замінити логотип' : 'Завантажити логотип'}
                  />
                  {uploading && <p className="text-xs text-blue-500 mt-1">Завантаження...</p>}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            + Додати партнера
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✅ Збережено!</p>}

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
              disabled={saving || uploading}
              className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}