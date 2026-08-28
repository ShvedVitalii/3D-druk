'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function About3DPage() {
  const [data, setData] = useState({ title: 'Все про 3D-друк', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const item = items.find((i: any) => i.key === 'about_3d');
        if (item?.data) {
          setData(item.data);
        } else {
          setData({
            title: 'Все про 3D-друк',
            text: 'Текст сторінки "Все про 3D-друк" буде тут.'
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

  if (loading) return <div className="pt-32 pb-20 container-custom text-center">Завантаження...</div>;

  return (
    <div className="pt-32 pb-20 container-custom max-w-3xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-[#1a3c34] mb-6">{data.title}</h1>
      <div className="prose prose-lg text-gray-600 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}