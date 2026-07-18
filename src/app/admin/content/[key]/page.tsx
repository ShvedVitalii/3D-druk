'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

// Мапа українських назв для заголовка
const blockNames: Record<string, string> = {
  hero: 'Головний банер',
  features: 'Чому обирають нас?',
  materials: 'Матеріали',
  process: 'Як ми працюємо',
  pricing: 'Вартість та доставка',
  testimonials: 'Відгуки',
  faq: 'Часті запитання',
  finalCTA: 'Готові втілити ідею?',
};

export default function EditContentBlock() {
  const params = useParams();
  const key = Array.isArray(params.key) ? params.key[0] : params.key ?? '';
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<any>({
    defaultValues: { data: null }
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch content');
        const items = await res.json();
        const item = items.find((i: any) => i.key === key);
        if (item) {
          setValue('data', item.data);
        } else {
          // Якщо ключа немає, створюємо порожню структуру
          const arrayKeys = ['features', 'materials', 'process', 'pricing', 'testimonials', 'faq', 'gallery', 'services', 'printers'];
          const initialData = arrayKeys.includes(key) ? [] : {};
          setValue('data', initialData);
        }
      } catch (err) {
        setError('Не вдалося завантажити дані');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (key) fetchData();
  }, [key, setValue]);

  const onSubmit = async (formData: any) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data: formData.data }),
      });
      if (!res.ok) throw new Error('Помилка збереження');
      router.push('/admin');
    } catch (err) {
      setError('Не вдалося зберегти зміни');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Завантаження...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const data = watch('data');

  if (data === undefined) return <div className="p-8 text-center">Завантаження...</div>;

  // --- Рендеринг полів ---
  const renderFields = () => {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Масив порожній</p>
            <p className="text-sm">Додайте перший елемент, натиснувши кнопку нижче.</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => {
                const newData = [...data];
                if (key === 'features') {
                  newData.push({
                    icon: '📌',
                    title: 'Нова перевага',
                    shortDesc: 'Короткий опис',
                    longDesc: 'Детальний опис...',
                    color: 'bg-gray-100 text-gray-700'
                  });
                } else {
                  newData.push({});
                }
                setValue('data', newData);
              }}
            >
              + Додати перший елемент
            </button>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Масив з {data.length} елементів. Редагуйте кожен елемент окремо.</p>
          <div className="space-y-6">
            {data.map((item, index) => (
              <div key={index} className="border p-4 rounded-xl bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm text-gray-600">Елемент #{index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => {
                      const newData = [...data];
                      newData.splice(index, 1);
                      setValue('data', newData);
                    }}
                  >
                    ✕ Видалити цей
                  </button>
                </div>
                {renderObjectFields(`data.${index}`, item)}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => {
                const newData = [...data];
                if (newData.length > 0) {
                  const template = JSON.parse(JSON.stringify(newData[0]));
                  delete template.id;
                  delete template._id;
                  delete template.created_at;
                  delete template.updated_at;
                  newData.push(template);
                } else {
                  newData.push({});
                }
                setValue('data', newData);
              }}
            >
              + Додати елемент (за шаблоном)
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                if (data.length > 0) {
                  const newData = [...data];
                  newData.pop();
                  setValue('data', newData);
                }
              }}
            >
              Видалити останній
            </button>
          </div>
        </div>
      );
    }

    if (typeof data === 'object' && data !== null) {
      return renderObjectFields('data', data);
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Значення</label>
        <input
          type="text"
          {...register('data')}
          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
        />
      </div>
    );
  };

  function renderObjectFields(path: string, obj: any) {
    if (typeof obj !== 'object' || obj === null) {
      return (
        <input
          type="text"
          {...register(path)}
          className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
        />
      );
    }

    return (
      <div className="space-y-4">
        {Object.keys(obj).map((field) => {
          const value = obj[field];
          const fieldPath = `${path}.${field}`;

          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
              <div key={field} className="border-l-4 border-[#c9a84c] pl-4">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field}
                </label>
                {renderObjectFields(fieldPath, value)}
              </div>
            );
          }

          if (Array.isArray(value)) {
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {field} (масив)
                </label>
                <textarea
                  {...register(fieldPath)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition font-mono text-sm"
                  rows={3}
                />
              </div>
            );
          }

          return (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              {typeof value === 'boolean' ? (
                <select {...register(fieldPath)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <option value="true">Так</option>
                  <option value="false">Ні</option>
                </select>
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  step="any"
                  {...register(fieldPath)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              ) : (
                <input
                  type="text"
                  {...register(fieldPath)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const displayName = key ? (blockNames[key] || key) : 'Вміст';

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a3c34] capitalize">Редагування: {displayName}</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
          >
            ← На головну
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderFields()}

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                saving || !isDirty ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a3c34] hover:bg-[#2d5a4b]'
              }`}
            >
              {saving ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}