'use client';

import { useEffect, useState } from 'react';

export default function PrivacyPage() {
  const [data, setData] = useState({ title: 'Політика конфіденційності', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const item = items.find((i: any) => i.key === 'privacy');
        if (item?.data) {
          setData(item.data);
        } else {
          setData({
            title: 'Політика конфіденційності',
            text: '## 1. Загальні положення\n\nЦя Політика конфіденційності визначає, як ми збираємо, використовуємо та захищаємо ваші персональні дані.'
          });
        }
      } catch (err) {
        console.error('Помилка завантаження:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Функція форматування тексту з заголовками
  const formatText = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Заголовок другого рівня
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="text-2xl font-heading font-semibold text-[#1a3c34] mt-8 mb-3">${trimmed.slice(3)}</h2>`;
        continue;
      }

      // Заголовок третього рівня
      if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="text-xl font-heading font-semibold text-[#1a3c34] mt-6 mb-2">${trimmed.slice(4)}</h3>`;
        continue;
      }

      // Список (якщо рядок починається з "- ")
      if (trimmed.startsWith('- ')) {
        if (!inList) { html += '<ul class="list-disc pl-6 space-y-1 my-2">'; inList = true; }
        html += `<li class="text-gray-600">${trimmed.slice(2)}</li>`;
        continue;
      }

      // Закриваємо список, якщо був
      if (inList && trimmed !== '') {
        html += '</ul>';
        inList = false;
      }

      // Порожній рядок -> пропускаємо
      if (trimmed === '') continue;

      // Звичайний абзац
      html += `<p class="text-gray-600 leading-relaxed mb-4">${trimmed}</p>`;
    }

    if (inList) html += '</ul>';
    return html;
  };

  if (loading) return <div className="pt-32 pb-20 container-custom text-center">Завантаження...</div>;

  return (
    <div className="pt-32 pb-20 container-custom max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-[#1a3c34] mb-6">{data.title}</h1>
      <div
        className="prose prose-lg text-gray-600 max-w-none"
        dangerouslySetInnerHTML={{ __html: formatText(data.text) }}
      />
    </div>
  );
}