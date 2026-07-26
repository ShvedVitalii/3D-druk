'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';
import { calculateDiscount, calculateOldPrice } from '@/lib/priceUtils';

type Spec = { label: string; value: string };
type Product = {
  id: string;
  categoryId: string;
  title: string;
  images: string[];
  price: number;
  oldPrice: number;
  discount: number;
  description: string;
  specs: Spec[];
  inStock: boolean;
  hidden: boolean;
  maxQuantity?: number;
};

export default function EditProduct() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const productId = params.productId as string;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchData();
  }, [categoryId, productId]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const cat = data.categories?.find((c: any) => c.id === categoryId);
      if (cat) setCategoryName(cat.name);
      const found = data.products?.find((p: any) => p.id === productId);
      if (found) setProduct(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProduct((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handlePriceChange = (field: 'price' | 'oldPrice' | 'discount', value: number) => {
    if (!product) return;
    setProduct(prev => {
      if (!prev) return null;
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
    if (!file || !product) return;
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
        const newImages = [...product.images];
        newImages[index] = data.fileUrl;
        setProduct({ ...product, images: newImages });
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const addImage = () => {
    if (!product) return;
    setProduct({ ...product, images: [...product.images, ''] });
  };

  const removeImage = (index: number) => {
    if (!product || product.images.length <= 1) return;
    setProduct({ ...product, images: product.images.filter((_, i) => i !== index) });
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    if (!product) return;
    const newSpecs = [...product.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setProduct({ ...product, specs: newSpecs });
  };

  const addSpec = () => {
    if (!product) return;
    setProduct({ ...product, specs: [...product.specs, { label: '', value: '' }] });
  };

  const removeSpec = (index: number) => {
    if (!product || product.specs.length <= 1) return;
    setProduct({ ...product, specs: product.specs.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/catalog');
      const data = await res.json();
      const updatedProducts = data.products.map((p: any) =>
        p.id === productId ? product : p
      );
      await fetch('/api/admin/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts }),
      });
      router.push(`/admin/catalog/${categoryId}`);
      router.refresh();
    } catch (err) {
      alert('Помилка збереження');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (!product) return <div className="text-center py-10 text-red-500">Товар не знайдено</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#1a3c34]">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-[#1a3c34]">
          Редагування {product.title} у {categoryName}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Назва *</label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ціна *</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => handlePriceChange('price', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" step="1" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Стара ціна</label>
              <input
                type="number"
                value={product.oldPrice}
                onChange={(e) => handlePriceChange('oldPrice', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Знижка (%)</label>
              <input
                type="number"
                value={product.discount}
                onChange={(e) => handlePriceChange('discount', parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                min="0" max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
            <textarea
              value={product.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Матеріал</label>
              <input
                type="text"
                value={product.specs.find((s) => s.label === 'Матеріал')?.value || ''}
                onChange={(e) => {
                  const newSpecs = [...product.specs];
                  const idx = newSpecs.findIndex((s) => s.label === 'Матеріал');
                  if (idx >= 0) {
                    newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                  } else {
                    newSpecs.push({ label: 'Матеріал', value: e.target.value });
                  }
                  setProduct({ ...product, specs: newSpecs });
                }}
                className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                placeholder="PLA, ABS, PETG..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Розміри (Ш×Д×В)</label>
              <input
                type="text"
                value={product.specs.find((s) => s.label === 'Розміри')?.value || ''}
                onChange={(e) => {
                  const newSpecs = [...product.specs];
                  const idx = newSpecs.findIndex((s) => s.label === 'Розміри');
                  if (idx >= 0) {
                    newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                  } else {
                    newSpecs.push({ label: 'Розміри', value: e.target.value });
                  }
                  setProduct({ ...product, specs: newSpecs });
                }}
                className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                placeholder="15×10×5 см"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Вага</label>
              <input
                type="text"
                value={product.specs.find((s) => s.label === 'Вага')?.value || ''}
                onChange={(e) => {
                  const newSpecs = [...product.specs];
                  const idx = newSpecs.findIndex((s) => s.label === 'Вага');
                  if (idx >= 0) {
                    newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                  } else {
                    newSpecs.push({ label: 'Вага', value: e.target.value });
                  }
                  setProduct({ ...product, specs: newSpecs });
                }}
                className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                placeholder="120 г"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Максимальна кількість для замовлення</label>
            <input
              type="number"
              value={product.maxQuantity ?? ''}
              onChange={(e) => handleChange('maxQuantity', e.target.value === '' ? undefined : parseInt(e.target.value))}
              min="0"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            />
            <p className="text-xs text-gray-400 mt-1">0 або порожньо = без обмежень</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Зображення</label>
            {product.images.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                {url && <img src={url} alt="preview" className="w-12 h-12 object-cover rounded border" />}
                <FileUpload
                  onFileSelect={(file) => handleImageUpload(file, index)}
                  accept=".jpg,.jpeg,.png,.webp"
                  maxSize={5 * 1024 * 1024}
                  label={url ? 'Замінити' : 'Завантажити'}
                />
                {product.images.length > 1 && (
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
            {product.specs.map((spec, index) => {
              if (['Матеріал', 'Розміри', 'Вага'].includes(spec.label)) return null;
              return (
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
              );
            })}
            <button
              type="button"
              onClick={addSpec}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Додати характеристику
            </button>
            <p className="text-xs text-gray-400 mt-1">Матеріал, Розміри та Вага редагуються окремо вище.</p>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={product.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
              />
              В наявності
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={product.hidden}
                onChange={(e) => handleChange('hidden', e.target.checked)}
                className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
              />
              Сховати
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