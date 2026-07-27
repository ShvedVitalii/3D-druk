'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FileUpload from '@/components/forms/FileUpload';

type Element = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
};

type Model = {
  id: string;
  name: string;
  elements: Element[];
};

export default function EditCustomModels() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const modelItem = items.find((item: any) => item.key === 'custom_models');
      if (modelItem?.data && Array.isArray(modelItem.data) && modelItem.data.length > 0) {
        // Нормалізація даних: переконуємося, що кожна модель має поле elements (масив)
        const normalized = modelItem.data.map((m: any) => {
          // Якщо є поле elements і це масив – використовуємо його
          if (Array.isArray(m.elements)) {
            return m;
          }
          // Якщо є поле photos (старий формат) – конвертуємо
          if (Array.isArray(m.photos)) {
            return {
              ...m,
              elements: m.photos.map((p: any) => ({
                id: p.id || `${m.id}-${Date.now()}-${Math.random()}`,
                title: p.title || 'Фото',
                description: p.description || '',
                image: p.src || p.image || '',
                category: m.category || 'Категорія',
                tags: m.tags || [],
              })),
            };
          }
          // Якщо є поле image (один файл) – створюємо один елемент
          if (m.image) {
            return {
              ...m,
              elements: [
                {
                  id: `${m.id}-0`,
                  title: m.title || 'Модель',
                  description: m.description || '',
                  image: m.image,
                  category: m.category || 'Категорія',
                  tags: m.tags || [],
                },
              ],
            };
          }
          // Якщо немає жодних даних – створюємо порожній масив
          return {
            ...m,
            elements: [],
          };
        });
        setModels(normalized);
      } else {
        // Дефолтні дані
        setModels([
          {
            id: '1',
            name: 'Протези',
            elements: [
              {
                id: '1-1',
                title: 'Біонічний протез руки',
                description: 'Функціональний протез з адаптивним захватом, надрукований за індивідуальними параметрами.',
                image: '/images/gallery/7.jpg',
                category: 'Протези',
                tags: ['AMS-друк', 'TPU', 'Точність 0.05 мм'],
              },
              {
                id: '1-2',
                title: 'Протез кисті',
                description: 'Легка конструкція з посиленими вузлами для щоденного використання.',
                image: '/images/gallery/9.jpg',
                category: 'Протези',
                tags: ['PETG', 'Висока міцність'],
              },
            ],
          },
          {
            id: '2',
            name: 'Механізми',
            elements: [
              {
                id: '2-1',
                title: 'Коробка передач (прототип)',
                description: 'Тестовий зразок складної механічної системи з рухомими елементами.',
                image: '/images/gallery/4.jpg',
                category: 'Механізми',
                tags: ['ABS', 'Шліфування'],
              },
            ],
          },
          {
            id: '3',
            name: 'Арт-фігурки',
            elements: [
              {
                id: '3-1',
                title: 'Фігурка Телелан',
                description: 'Авторська модель з деталізацією до 0.1 мм, надрукована в 4 кольори.',
                image: '/images/gallery/18.jpg',
                category: 'Арт-фігурки',
                tags: ['PLA', 'Багатоколірний AMS'],
              },
            ],
          },
        ]);
      }
    } catch (err) {
      setError('Не вдалося завантажити моделі');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addModel = () => {
    const newModel: Model = {
      id: Date.now().toString(),
      name: 'Нова група',
      elements: [],
    };
    setModels([...models, newModel]);
  };

  const removeModel = (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю групу?')) return;
    setModels(models.filter((m) => m.id !== id));
  };

  const handleModelNameChange = (id: string, value: string) => {
    setModels(models.map((m) => (m.id === id ? { ...m, name: value } : m)));
  };

  const addElement = (modelId: string) => {
    const newElement: Element = {
      id: `${modelId}-${Date.now()}`,
      title: 'Новий виріб',
      description: 'Опис...',
      image: '',
      category: 'Категорія',
      tags: [],
    };
    setModels(
      models.map((m) =>
        m.id === modelId ? { ...m, elements: [...m.elements, newElement] } : m
      )
    );
  };

  const removeElement = (modelId: string, elementId: string) => {
    if (!confirm('Видалити цей виріб?')) return;
    setModels(
      models.map((m) =>
        m.id === modelId
          ? { ...m, elements: m.elements.filter((e) => e.id !== elementId) }
          : m
      )
    );
  };

  const handleElementChange = (
    modelId: string,
    elementId: string,
    field: keyof Element,
    value: any
  ) => {
    setModels(
      models.map((m) =>
        m.id === modelId
          ? {
              ...m,
              elements: m.elements.map((e) =>
                e.id === elementId ? { ...e, [field]: value } : e
              ),
            }
          : m
      )
    );
  };

  const handleElementTagsChange = (modelId: string, elementId: string, value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    handleElementChange(modelId, elementId, 'tags', tags);
  };

  const handleImageUpload = async (file: File | null, modelId: string, elementId: string) => {
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
        setModels(
          models.map((m) =>
            m.id === modelId
              ? {
                  ...m,
                  elements: m.elements.map((e) =>
                    e.id === elementId ? { ...e, image: result.fileUrl } : e
                  ),
                }
              : m
          )
        );
      }
    } catch (err) {
      alert('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
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
        body: JSON.stringify({ key: 'custom_models', data: models }),
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
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">✨ Розробка авторських моделей</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-500">
            Група – це категорія (наприклад, "Протези"). Усередині групи можна додавати кілька виробів з фото, назвою, описом, категорією та тегами.
          </p>

          {models.map((model) => (
            <div key={model.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <input
                  type="text"
                  value={model.name}
                  onChange={(e) => handleModelNameChange(model.id, e.target.value)}
                  className="text-xl font-bold text-[#1a3c34] bg-transparent border-b-2 border-transparent focus:border-[#c9a84c] outline-none transition px-2 py-1 w-64"
                  placeholder="Назва групи"
                />
                <button
                  type="button"
                  onClick={() => removeModel(model.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Видалити групу
                </button>
              </div>

              <div className="space-y-3 mt-3">
                {model.elements && model.elements.length > 0 ? (
                  model.elements.map((element) => (
                    <div key={element.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Виріб</span>
                        <button
                          type="button"
                          onClick={() => removeElement(model.id, element.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Назва</label>
                          <input
                            type="text"
                            value={element.title}
                            onChange={(e) =>
                              handleElementChange(model.id, element.id, 'title', e.target.value)
                            }
                            className="w-full p-1.5 bg-gray-50 rounded border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Категорія</label>
                          <input
                            type="text"
                            value={element.category}
                            onChange={(e) =>
                              handleElementChange(model.id, element.id, 'category', e.target.value)
                            }
                            className="w-full p-1.5 bg-gray-50 rounded border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600">Опис</label>
                          <input
                            type="text"
                            value={element.description}
                            onChange={(e) =>
                              handleElementChange(model.id, element.id, 'description', e.target.value)
                            }
                            className="w-full p-1.5 bg-gray-50 rounded border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600">Теги (через кому)</label>
                          <input
                            type="text"
                            value={element.tags.join(', ')}
                            onChange={(e) =>
                              handleElementTagsChange(model.id, element.id, e.target.value)
                            }
                            className="w-full p-1.5 bg-gray-50 rounded border border-gray-200 focus:border-[#c9a84c] outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Фото</label>
                          <div className="flex items-center gap-3">
                            {element.image && (
                              <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                <Image src={element.image} alt={element.title} fill className="object-cover" unoptimized />
                              </div>
                            )}
                            <FileUpload
                              onFileSelect={(file) => handleImageUpload(file, model.id, element.id)}
                              accept=".jpg,.jpeg,.png,.webp,.svg"
                              allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
                              maxSize={5 * 1024 * 1024}
                              label={element.image ? 'Замінити' : 'Завантажити'}
                            />
                            {uploading && <span className="text-xs text-blue-500">Завантаження...</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400 text-sm bg-white rounded-lg border border-gray-200">
                    Немає виробів у цій групі. Додайте перший!
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => addElement(model.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  + Додати виріб у групу
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addModel}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            + Додати нову групу
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