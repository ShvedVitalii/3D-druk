'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';
import { generateSlug } from '@/lib/transliterate';

export default function NewCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.fileUrl) {
        setImage(data.fileUrl);
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введіть назву категорії');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();

      const newCategory = {
        id: `cat_${Date.now()}`,
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        image: image.trim() || '',
        description: description.trim() || '',
        order: order || 0,
      };

      const newCategories = [...(data.categories || []), newCategory];

      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories }),
      });

      router.push('/admin/catalog');
      router.refresh();
    } catch (err) {
      alert('Помилка створення категорії');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#1a3c34]">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-[#1a3c34]">Нова категорія</h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва категорії *</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              placeholder="Наприклад: Іграшки"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Слаг (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              placeholder="igrashky"
            />
            <p className="text-xs text-gray-400 mt-1">Автоматично генерується з назви (транслітерація)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядок сортування</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">Чим менше число, тим вище категорія в списку</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Обкладинка</label>
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".jpg,.jpeg,.png,.webp,.svg"
              allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
              maxSize={5 * 1024 * 1024}
              label="Завантажте фото категорії"
            />
            {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
            {image && <p className="text-sm text-green-600 mt-1">✅ Фото завантажено</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/catalog')}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
            >
              {loading ? 'Створення...' : 'Створити категорію'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}