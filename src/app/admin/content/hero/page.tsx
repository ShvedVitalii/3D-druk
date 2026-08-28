'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';

export default function EditHero() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState({
    title: 'Ваші ідеї у 3D',
    subtitle:
      'Професійний 3D-друк на замовлення. Швидко, якісно, доступно. Допомагаємо ЗСУ – друкуємо адаптери, кріплення та тактичні аксесуари.',
    buttonText: 'Замовити друк',
    heroVideo: '',
    donationButtonText: 'Донат',
    donationLink: 'https://send.monobank.ua/jar/4XgUntFv2W',
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const heroItem = items.find((item: any) => item.key === 'hero');
      if (heroItem?.data) {
        setData((prev) => ({ ...prev, ...heroItem.data }));
      }
    } catch (err) {
      setError('Не вдалося завантажити дані');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = async (file: File | null) => {
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
        setData((prev) => ({ ...prev, heroVideo: result.fileUrl }));
      }
    } catch (err) {
      alert('Помилка завантаження відео');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = () => {
    setData((prev) => ({ ...prev, heroVideo: '' }));
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
        body: JSON.stringify({ key: 'hero', data }),
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
        <h1 className="text-3xl font-bold text-[#1a3c34]">Редагування головного банера (Hero)</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Підзаголовок</label>
            <textarea
              value={data.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Текст кнопки "Замовити"</label>
            <input
              type="text"
              value={data.buttonText}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          {/* === КНОПКА ДОНАТУ === */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-bold text-[#1a3c34] mb-3">❤️ Кнопка Донат</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Текст кнопки</label>
              <input
                type="text"
                value={data.donationButtonText || 'Донат'}
                onChange={(e) => handleChange('donationButtonText', e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Посилання для донату</label>
              <input
                type="url"
                value={data.donationLink || ''}
                onChange={(e) => handleChange('donationLink', e.target.value)}
                placeholder="https://send.monobank.ua/jar/..."
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
            </div>
          </div>

          {/* === ВІДЕО === */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-bold text-[#1a3c34] mb-3">🎬 Відео для фону</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-sm text-blue-800">
              💡 Завантажте відео, яке буде фоном у банері. Рекомендований формат: MP4, розмір не більше 50 МБ.
              Якщо відео не завантажено, буде використано градієнтний фон.
            </div>
            {data.heroVideo && (
              <div className="mb-3">
                <video
                  src={data.heroVideo}
                  className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ✕ Видалити відео
                </button>
              </div>
            )}
            <FileUpload
              onFileSelect={handleVideoUpload}
              accept=".mp4,.webm,.mov"
              allowedExtensions={['mp4', 'webm', 'mov']}
              maxSize={50 * 1024 * 1024}
              label={data.heroVideo ? 'Замінити відео' : 'Завантажити відео'}
            />
            {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
          </div>

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
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}