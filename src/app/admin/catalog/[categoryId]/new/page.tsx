'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';
import { calculateDiscount, calculateOldPrice } from '@/lib/priceUtils';

type Spec = { label: string; value: string };

export default function NewProduct() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [form, setForm] = useState({
    title: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    description: '',
    images: [''] as string[],
    inStock: true,
    hidden: false,
  });
  const [specs, setSpecs] = useState<Spec[]>([{ label: '', value: '' }]);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const cat = data.categories?.find((c: any) => c.id === categoryId);
      if (cat) setCategoryName(cat.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: 'price' | 'oldPrice' | 'discount', value: number) => {
    setForm(prev => {
      const newState = { ...prev, [field]: value };
      if (field === 'price' && newState.oldPrice > 0 && newState.oldPrice > newState.price) {
        newState.discount = calculateDiscount(newState.oldPrice, newState.price);
      }
      if (field === 'oldPrice' && newState.oldPrice > 0 && newState.oldPrice > newState.price) {
        newState.discount = calculateDiscount(newState.oldPrice, newState.price);
      }
      if (field === 'discount' && newState.discount > 0 && newState.discount < 100 && newState.price > 0) {
        newState.oldPrice = calculateOldPrice(newState.price, newState.discount);
      }
      return newState;
    });
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
        const newImages = [...form.images];
        newImages[index] = data.fileUrl;
        setForm(prev => ({ ...prev, images: newImages }));
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const addImage = () => {
    setForm(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    if (form.images.length <= 1) return;
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecs(newSpecs);
  };

  const addSpec = () => setSpecs([...specs, { label: '', value: '' }]);
  const removeSpec = (index: number) => {
    if (specs.length <= 1) return;
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Введіть назву товару');
      return;
    }
    const validSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    const validImages = form.images.filter((url) => url.trim());
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const newProduct = {
        id: `prod_${Date.now()}`,
        categoryId,
        ...form,
        images: validImages.length > 0 ? validImages : ['/images/placeholder.jpg'],
        specs: validSpecs,
        createdAt: new Date().toISOString(),
      };
      const newProducts = [...(data.products || []), newProduct];
      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts }),
      });
      router.push(`/admin/catalog/${categoryId}`);
      router.refresh();
    } catch (err) {
      alert('Помилка створення товару');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#1a3c34]">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-[#1a3c34]">
          Новий товар у категорії {categoryName}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва товару *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ціна (грн) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handlePriceChange('price', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" step="1" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Стара ціна</label>
              <input
                type="number"
                value={form.oldPrice}
                onChange={(e) => handlePriceChange('oldPrice', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Знижка (%)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => handlePriceChange('discount', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Зображення</label>
            {form.images.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                {url && <img src={url} alt="preview" className="w-12 h-12 object-cover rounded border" />}
                <FileUpload
                  onFileSelect={(file) => handleImageUpload(file, index)}
                  accept=".jpg,.jpeg,.png,.webp"
                  maxSize={5 * 1024 * 1024}
                  label={url ? 'Замінити' : 'Завантажити'}
                />
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Додати фото
            </button>
            {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Характеристики</label>
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                  placeholder="Назва"
                  className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Значення"
                  className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Додати характеристику
            </button>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
              />
              В наявності
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => handleChange('hidden', e.target.checked)}
                className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
              />
              Сховати з каталогу
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push(`/admin/catalog/${categoryId}`)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
            >
              {loading ? 'Створення...' : 'Створити товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}