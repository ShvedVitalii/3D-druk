'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AdminPrinters() {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPrinters();
  }, []);

  const fetchPrinters = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const printerItem = items.find((item: any) => item.key === 'printers');
      setPrinters(printerItem?.data || []);
    } catch (err) {
      setError('Не вдалося завантажити принтери');
    } finally {
      setLoading(false);
    }
  };

  const deletePrinter = async (index: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей принтер?')) return;
    try {
      const newPrinters = [...printers];
      newPrinters.splice(index, 1);
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'printers', data: newPrinters }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setPrinters(newPrinters);
      router.refresh();
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  const toggleHidden = async (index: number) => {
    const newPrinters = [...printers];
    newPrinters[index] = { ...newPrinters[index], hidden: !newPrinters[index].hidden };
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'printers', data: newPrinters }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setPrinters(newPrinters);
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Управління принтерами</h1>
        <Link
          href="/admin/printers/new"
          className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
        >
          + Додати принтер
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Назва</th>
                <th className="text-left p-4 font-semibold text-gray-600">Тег</th>
                <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
                <th className="text-right p-4 font-semibold text-gray-600">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {printers.map((printer, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-[#1a3c34]">{printer.name}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {printer.tag}
                    </span>
                  </td>
                  <td className="p-4">
                    {printer.hidden ? (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Сховано</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Видимо</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => toggleHidden(index)}
                      className={`px-3 py-1 text-xs rounded-lg transition ${
                        printer.hidden
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {printer.hidden ? 'Показати' : 'Сховати'}
                    </button>
                    <Link
                      href={`/admin/printers/edit/${index}`}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      Редагувати
                    </Link>
                    <button
                      onClick={() => deletePrinter(index)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
              {printers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">
                    Принтерів поки немає. Натисніть "Додати принтер".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}