'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FileUpload from '@/components/forms/FileUpload';

type GalleryItem = {
  src: string;
  title: string;
};

export default function EditGallery() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([
    { src: '/images/gallery/1.jpg', title: 'Фігурка дракона' },
    { src: '/images/gallery/2.jpg', title: 'Колекція іграшок' },
    { src: '/images/gallery/3.jpg', title: 'Прототип деталі' },
    { src: '/images/gallery/4.jpg', title: 'Коробка передач' },
    { src: '/images/gallery/5.jpg', title: 'Масажні ролери' },
  ]);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const galleryItem = data.find((item: any) => item.key === 'gallery');
      if (galleryItem?.data && Array.isArray(galleryItem.data)) {
        setItems(galleryItem.data);
      }
    } catch (err) {
      setError('Не вдалося завантажити галерею');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], title: value };
    setItems(newItems);
  };

  const handleImageUpload = async (file: File | null, index: number) => {
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
        const newItems = [...items];
        newItems[index] = { ...newItems[index], src: data.fileUrl };
        setItems(newItems);
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const addItem = () => {
    if (items.length >= 5) {
      alert('Максимум 5 фото');
      return;
    }
    setItems([...items, { src: '', title: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      alert('Має бути хоча б одне фото');
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const item of items) {
      if (!item.src.trim() || !item.title.trim()) {
        alert('Будь ласка, заповніть всі поля (завантажте фото та введіть назву)');
        return;
      }
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'gallery', data: items }),
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Редагування: Наші роботи</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-500">Максимум 5 фото. Перше фото буде великим (на 2 ряди).</p>

          {items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3 relative">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#1a3c34]">Фото #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Видалити
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Завантажити фото</label>
                {item.src && (
                  <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mb-2">
                    <Image src={item.src} alt="preview" fill className="object-cover" unoptimized />
                  </div>
                )}
                <FileUpload
                  onFileSelect={(file) => handleImageUpload(file, index)}
                  accept=".jpg,.jpeg,.png,.webp,.svg"
                  allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
                  maxSize={5 * 1024 * 1024}
                  label={item.src ? 'Замінити фото' : 'Завантажити фото'}
                />
                {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва *</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                  placeholder="Фігурка дракона"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            disabled={items.length >= 5}
            className={`px-4 py-2 rounded-lg transition text-sm font-medium ${
              items.length >= 5
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            + Додати фото ({items.length}/5)
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