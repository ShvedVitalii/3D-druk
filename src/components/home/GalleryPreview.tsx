'use client';
import Button from '@/components/ui/Button';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function GalleryPreview({ data }: { data?: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const previewImages = data && data.length > 0 ? data : [
    { src: '/images/gallery/1.jpg', title: 'Фігурка дракона' },
    { src: '/images/gallery/2.jpg', title: 'Колекція іграшок' },
    { src: '/images/gallery/3.jpg', title: 'Прототип деталі' },
    { src: '/images/gallery/4.jpg', title: 'Коробка передач' },
    { src: '/images/gallery/5.jpg', title: 'Масажні ролери' },
  ];

  const images = previewImages.slice(0, 5);

  return (
    <section ref={ref} className="py-28 bg-[#f5f0eb]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-[#1a3c34]">Наші роботи</h2>
          <p className="text-[#5a5a5a] text-lg">Реальні приклади виробів</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4 mb-10"
        >
          {images[0] && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group md:row-span-2"
            >
              <Image
                src={images[0].src}
                alt={images[0].title || 'Робота 1'}
                fill
                className="object-cover group-hover:scale-110 transition duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-white font-heading font-bold text-lg">{images[0].title}</p>
              </div>
            </motion.div>
          )}
          {images[1] && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
            >
              <Image src={images[1].src} alt={images[1].title || 'Робота 2'} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-white font-heading font-bold text-lg">{images[1].title}</p>
              </div>
            </motion.div>
          )}
          {images[2] && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
            >
              <Image src={images[2].src} alt={images[2].title || 'Робота 3'} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-white font-heading font-bold text-lg">{images[2].title}</p>
              </div>
            </motion.div>
          )}
          {images[3] && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
            >
              <Image src={images[3].src} alt={images[3].title || 'Робота 4'} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-white font-heading font-bold text-lg">{images[3].title}</p>
              </div>
            </motion.div>
          )}
          {images[4] && (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
            >
              <Image src={images[4].src} alt={images[4].title || 'Робота 5'} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-white font-heading font-bold text-lg">{images[4].title}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="text-center">
          <Button href="/gallery" variant="secondary">Всі роботи</Button>
        </div>
      </div>
    </section>
  );
}