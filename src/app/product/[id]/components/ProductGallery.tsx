'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Компонент модалки для перегляду фото
function ImageModal({ images, currentIndex, onClose }: { images: string[]; currentIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(currentIndex);

  const goPrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const goNext = () => setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white text-3xl transition z-10"
        >
          ✕
        </button>
        
        <div className="relative w-full h-[70vh] bg-black rounded-xl overflow-hidden">
          <Image
            src={images[index]}
            alt="Фото товару"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl transition"
            >
              ›
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function ProductGallery({ images, mainImage }: { images: string[]; mainImage: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allImages = images.length > 0 ? images : [mainImage];

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group">
        <Image
          src={allImages[selectedIndex] || mainImage}
          alt="Фото товару"
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-4 py-2 rounded-full text-sm transition">
            🔍 Збільшити
          </span>
        </div>
      </div>
      
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border-2 cursor-pointer transition ${
                selectedIndex === i ? 'border-[#c9a84c]' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Image src={img} alt={`Фото ${i + 1}`} fill className="object-cover" unoptimized />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <ImageModal
            images={allImages}
            currentIndex={selectedIndex}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}