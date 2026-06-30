'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const images = [
  { src: '/images/gallery/1.jpg', title: 'Фігурка дракона', category: 'Іграшки' },
  { src: '/images/gallery/2.jpg', title: 'Прототип деталі', category: 'Прототипи' },
  { src: '/images/gallery/3.jpg', title: 'Ваза для квітів', category: 'Декор' },
  { src: '/images/gallery/4.jpg', title: 'Шахові фігури', category: 'Іграшки' },
  { src: '/images/gallery/5.jpg', title: 'Підставка для телефону', category: 'Декор' },
  { src: '/images/gallery/6.jpg', title: 'Архітектурний макет', category: 'Прототипи' },
];

const categories = ['Всі', 'Іграшки', 'Прототипи', 'Декор'];

export default function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState('Всі');

  const filtered = filter === 'Всі' ? images : images.filter(img => img.category === filter);

  return (
    <div className="pt-32 pb-20 container-custom">
      <h1 className="text-center mb-4 text-[#1a3c34] font-serif text-4xl font-bold">Галерея робіт</h1>
      <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
        Результати нашої роботи — від дрібних деталей до великих макетів.
      </p>

      <div className="flex justify-center gap-3 flex-wrap mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === cat ? 'bg-[#1a3c34] text-white shadow-lg shadow-[#1a3c34]/20' : 'bg-[#f5f0eb] text-gray-600 hover:bg-[#e8e0d8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((img, idx) => (
          <motion.div
            key={idx}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ scale: 1.03 }}
            className="relative h-72 rounded-2xl overflow-hidden shadow-lg cursor-pointer group border border-[#d0c8c0]/50"
            onClick={() => setSelected(images.indexOf(img))}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-6">
              <p className="text-white font-serif text-xl font-bold">{img.title}</p>
              <p className="text-[#7ec8a3] text-sm">{img.category}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl w-full h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected].src}
              alt={images[selected].title}
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/40 transition"
              onClick={() => setSelected(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 text-center border-t border-gray-200">
              <p className="font-serif font-bold text-[#1a3c34]">{images[selected].title}</p>
              <p className="text-gray-500 text-sm">{images[selected].category}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}