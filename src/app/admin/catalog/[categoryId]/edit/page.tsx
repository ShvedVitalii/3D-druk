'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';
import { generateSlug } from '@/lib/transliterate';

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
};

export default function EditCategory() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const found = data.categories?.find((c: any) => c.id === categoryId);
      setCategory(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    const value = e.target.value;
    const newSlug = generateSlug(value);
    setCategory({
      ...category,
      name: value,
      slug: category.slug === generateSlug(category.name) ? newSlug : category.slug,
    });
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file || !category) return;
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
        setCategory({ ...category, image: data.fileUrl });
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const updatedCategories = data.categories.map((c: any) =>
        c.id === categoryId ? category : c
      );

      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCategories }),
      });

      router.push('/admin/catalog');
      router.refresh();
    } catch (err) {
      alert('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (!category) return <div className="text-center py-10 text-red-500">Категорію не знайдено</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#1a3c34]">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-[#1a3c34]">Редагування категорії</h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва категорії *</label>
            <input
              type="text"
              value={category.name}
              onChange={handleNameChange}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Слаг (URL)</label>
            <input
              type="text"
              value={category.slug}
              onChange={(e) => setCategory({ ...category, slug: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">Автоматично генерується з назви (транслітерація)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Порядок сортування</label>
            <input
              type="number"
              value={category.order || 0}
              onChange={(e) => setCategory({ ...category, order: Number(e.target.value) })}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">Чим менше число, тим вище категорія в списку</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Обкладинка</label>
            {category.image && (
              <div className="mb-2">
                <img src={category.image} alt="Поточне фото" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".jpg,.jpeg,.png,.webp,.svg"
              allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
              maxSize={5 * 1024 * 1024}
              label={category.image ? 'Замінити фото' : 'Завантажити фото'}
            />
            {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <textarea
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
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
              disabled={saving || uploading}
              className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}