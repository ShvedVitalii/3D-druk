'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Printer = {
  name: string;
  tag: string;
  img: string;
  specs: { label: string; value: string }[];
  description: string;
  color: string;
  featured: boolean;
  hidden?: boolean;
};

export default function EditPrinter() {
  const params = useParams();
  const index = parseInt(params.index as string);
  const router = useRouter();
  const [printer, setPrinter] = useState<Printer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrinter();
  }, [index]);

  const fetchPrinter = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const printerItem = items.find((item: any) => item.key === 'printers');
      const printers = printerItem?.data || [];
      if (index >= 0 && index < printers.length) {
        setPrinter(printers[index]);
      } else {
        setError('Принтер не знайдено');
      }
    } catch (err) {
      setError('Не вдалося завантажити принтер');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setPrinter(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSpecChange = (specIndex: number, field: 'label' | 'value', value: string) => {
    if (!printer) return;
    const newSpecs = [...printer.specs];
    newSpecs[specIndex] = { ...newSpecs[specIndex], [field]: value };
    setPrinter({ ...printer, specs: newSpecs });
  };

  const addSpec = () => {
    if (!printer) return;
    setPrinter({ ...printer, specs: [...printer.specs, { label: '', value: '' }] });
  };

  const removeSpec = (specIndex: number) => {
    if (!printer) return;
    const newSpecs = [...printer.specs];
    newSpecs.splice(specIndex, 1);
    setPrinter({ ...printer, specs: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!printer) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content');
      const items = await res.json();
      const printerItem = items.find((item: any) => item.key === 'printers');
      const printers = printerItem?.data || [];
      printers[index] = printer;
      
      const updateRes = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'printers', data: printers }),
      });
      if (!updateRes.ok) throw new Error('Failed to save');
      router.push('/admin/printers');
    } catch (err) {
      setError('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!printer) return <div className="text-center py-10">Принтер не знайдено</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a3c34]">Редагування принтера</h1>
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
          <label className="block text-sm font-medium text-gray-700">Тег</label>
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
          <label className="block text-sm font-medium text-gray-700">Характеристики</label>
          {printer.specs.map((spec, specIndex) => (
            <div key={specIndex} className="flex gap-2 mt-2">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => handleSpecChange(specIndex, 'label', e.target.value)}
                placeholder="Назва характеристики"
                className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleSpecChange(specIndex, 'value', e.target.value)}
                placeholder="Значення"
                className="flex-1 p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
              />
              <button
                type="button"
                onClick={() => removeSpec(specIndex)}
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
            Флагманська модель
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
            disabled={saving}
            className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
          >
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </div>
  );
}