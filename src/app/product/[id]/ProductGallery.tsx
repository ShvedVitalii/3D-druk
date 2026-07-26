'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  mainImage: string;
}

export default function ProductGallery({ images, mainImage }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allImages = images.length > 0 ? images : [mainImage];

  // Стан для зуму та позиції
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Скидання зуму при закритті модалки
  useEffect(() => {
    if (!isModalOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isModalOpen]);

  // Обробка коліщатка для зуму
  const handleWheel = (e: React.WheelEvent) => {
    if (!isModalOpen) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  // Початок перетягування
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Переміщення при перетягуванні
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  // Завершення перетягування
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Подвійний клік для скидання зуму
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Головне фото + мініатюри знизу */}
      <div className="space-y-4">
        <div
          className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group"
          onClick={() => handleImageClick(selectedIndex)}
        >
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

        {/* Мініатюри знизу */}
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
      </div>

      {/* Повноекранна модалка з можливістю зуму */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            onWheel={handleWheel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закриття */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl transition z-20 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center"
              >
                ✕
              </button>

              {/* Кнопки навігації */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl transition z-20"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl transition z-20"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Збільшене фото з можливістю перетягування */}
              <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                style={{ cursor: scale > 1 ? 'grab' : 'default' }}
              >
                <motion.div
                  ref={imageRef}
                  className="relative w-full h-full max-w-5xl max-h-[85vh]"
                  animate={{
                    scale: scale,
                    x: position.x,
                    y: position.y,
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{
                    transformOrigin: 'center center',
                  }}
                >
                  <Image
                    src={allImages[selectedIndex]}
                    alt="Фото товару"
                    fill
                    className="object-contain"
                    unoptimized
                    draggable={false}
                  />
                </motion.div>

                {/* Підказка для користувача */}
                {scale <= 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm bg-black/30 px-4 py-2 rounded-full">
                    🖱 Коліщатко – збільшити • Перетягуй – розглянути
                  </div>
                )}
                {scale > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/30 px-4 py-2 rounded-full">
                    🔄 Перетягуй пальцем/мишкою • Подвійний клік – скинути
                  </div>
                )}

                {/* Індикатор масштабу */}
                {scale > 1 && (
                  <div className="absolute top-6 left-6 text-white/60 text-sm bg-black/30 px-3 py-1 rounded-full">
                    {Math.round(scale * 100)}%
                  </div>
                )}
              </div>

              {/* Пагінація знизу */}
              {allImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm z-20">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}