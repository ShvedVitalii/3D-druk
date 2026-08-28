'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ExternalLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

export default function EditExternalLinks() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<ExternalLink[]>([
    { id: '1', name: 'Printables.com', url: 'https://www.printables.com/model', icon: '🖨️' },
    { id: '2', name: 'Thingiverse', url: 'https://www.thingiverse.com/', icon: '🌐' },
    { id: '3', name: 'Cults3D', url: 'https://cults3d.com/', icon: '🎨' },
  ]);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const linkItem = items.find((item: any) => item.key === 'external_links');
      if (linkItem?.data && Array.isArray(linkItem.data) && linkItem.data.length > 0) {
        setLinks(linkItem.data);
      }
    } catch (err) {
      setError('Не вдалося завантажити посилання');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    const newLink: ExternalLink = {
      id: Date.now().toString(),
      name: 'Новий сайт',
      url: 'https://',
      icon: '🔗',
    };
    setLinks([...links, newLink]);
  };

  const removeLink = (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це посилання?')) return;
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleChange = (id: string, field: keyof ExternalLink, value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
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
        body: JSON.stringify({ key: 'external_links', data: links }),
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
        <h1 className="text-3xl font-bold text-[#1a3c34]">🌐 Більше моделей (зовнішні посилання)</h1>
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
            Ці посилання будуть відображатися у блоці "Більше моделей" в каталозі.
          </p>

          {links.map((link) => (
            <div key={link.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-[#1a3c34]">Посилання #{links.indexOf(link) + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Видалити
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Назва</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleChange(link.id, 'name', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Посилання (URL)</label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Іконка (emoji або SVG шлях)</label>
                  <input
                    type="text"
                    value={link.icon}
                    onChange={(e) => handleChange(link.id, 'icon', e.target.value)}
                    placeholder="🖨️"
                    className="w-full p-2 bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLink}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            + Додати посилання
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
              disabled={saving}
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