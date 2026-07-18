'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Spec = { label: string; value: string };

type Printer = {
  name: string;
  tag: string;
  img: string;
  specs: Spec[];
  description: string;
  color: string;
  featured: boolean;
  hidden: boolean;
};

export default function NewPrinter() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printer, setPrinter] = useState<Printer>({
    name: '',
    tag: '',
    img: '/images/printer/default.jpg',
    specs: [] as Spec[],
    description: '',
    color: '#c9a84c',
    featured: false,
    hidden: false,
  });

  const handleChange = (field: string, value: any) => {
    setPrinter(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...printer.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setPrinter(prev => ({ ...prev, specs: newSpecs }));
  };

  const addSpec = () => {
    setPrinter(prev => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...printer.specs];
    newSpecs.splice(index, 1);
    setPrinter(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content');
      const items = await res.json();
      const printerItem = items.find((item: any) => item.key === 'printers');
      const currentPrinters = printerItem?.data || [];
      const newPrinters = [...currentPrinters, printer];
      
      const updateRes = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'printers', data: newPrinters }),
      });
      if (!updateRes.ok) throw new Error('Failed to save');
      router.push('/admin/printers');
    } catch (err) {
      setError('Помилка створення принтера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a3c34]">Додати новий принтер</h1>
        <button
          onClick={() => router.push('/admin/printers')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← Назад до списку
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Назва</label>
          <input
            type="text"
            value={printer.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Тег (наприклад, "Флагманська модель")</label>
          <input
            type="text"
            value={printer.tag}
            onChange={(e) => handleChange('tag', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Шлях до зображення</label>
          <input
            type="text"
            value={printer.img}
            onChange={(e) => handleChange('img', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
            placeholder="/images/printer/default.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Колір акценту (hex)</label>
          <input
            type="text"
            value={printer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Опис</label>
          <textarea
            rows={3}
            value={printer.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Характеристики (специфікації)</label>
          {printer.specs.map((spec, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                placeholder="Назва характеристики"
                className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                placeholder="Значення"
                className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpec}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
          >
            + Додати характеристику
          </button>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={printer.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="w-4 h-4 text-[#c9a84c] focus:ring-[#c9a84c] border-gray-300 rounded"
            />
            Флагманська модель (показувати на головній)
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin/printers')}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {loading ? 'Збереження...' : 'Створити'}
          </button>
        </div>
      </form>
    </div>
  );
}