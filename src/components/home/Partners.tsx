'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

type Item = {
  id: string;
  name: string;
  logo: string;
  order: number;
};

type Data = {
  description: string;
  items: Item[];
};

export default function Partners() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const itemsPerView = 4;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const response = await res.json();
        const keyItem = response.find((item: any) => item.key === 'partners');
        if (keyItem?.data) {
          const raw = keyItem.data;
          setData({
            description: raw.description || 'Ми співпрацюємо з кращими',
            items: Array.isArray(raw.items) ? raw.items : [],
          });
        } else {
          setData({
            description: 'Ми співпрацюємо з кращими',
            items: [
              { id: '1', name: 'Партнер 1', logo: '/images/partners/partner1.png', order: 1 },
              { id: '2', name: 'Партнер 2', logo: '/images/partners/partner2.png', order: 2 },
            ],
          });
        }
      } catch (err) {
        console.error('Помилка завантаження партнерів:', err);
        setData({
          description: 'Ми співпрацюємо з кращими',
          items: [
            { id: '1', name: 'Партнер 1', logo: '/images/partners/partner1.png', order: 1 },
            { id: '2', name: 'Партнер 2', logo: '/images/partners/partner2.png', order: 2 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-gray-400">Завантаження партнерів...</div>;
  }

  if (!data) return null;

  const sortedItems = [...data.items].sort((a, b) => (a.order || 0) - (b.order || 0));
  const totalPages = Math.ceil(sortedItems.length / itemsPerView);

  const next = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex(prev => prev + 1);
  };
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* ПРИМУСОВИЙ ВИВІД ЗАГОЛОВКУ ТА ОПИСУ, ЯК У КЛІЄНТІВ */}
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#1a3c34] text-center mb-2">
          Наші партнери
        </h2>
        <p className="text-center text-gray-500 mb-8 text-lg">
          {data.description}
        </p>

        <div className="relative flex items-center">
          <button
            onClick={prev}
            disabled={currentIndex === 0 || totalPages === 0}
            className="absolute left-0 z-10 -translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 disabled:opacity-30 transition"
          >
            ‹
          </button>
          <div className="overflow-hidden mx-12 flex-1">
            {sortedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Наразі немає партнерів</div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalPages }).map((_, page) => (
                  <div key={page} className="flex w-full flex-shrink-0 justify-around gap-4">
                    {sortedItems.slice(page * itemsPerView, (page + 1) * itemsPerView).map((item) => (
                      <div key={item.id} className="flex flex-col items-center w-24 md:w-32">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-md bg-white flex items-center justify-center">
                          {item.logo ? (
                            <Image
                              src={item.logo}
                              alt={item.name}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-4xl text-gray-400">🤝</span>
                          )}
                        </div>
                        <p className="text-sm md:text-base font-semibold text-gray-800 mt-2 text-center bg-white/80 px-2 py-0.5 rounded">
                          {item.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={next}
            disabled={currentIndex === totalPages - 1 || totalPages === 0}
            className="absolute right-0 z-10 translate-x-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 disabled:opacity-30 transition"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}