'use client';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Materials({ data }: { data?: any[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ПОВНІ дефолтні дані (6 матеріалів)
  const defaultMaterials = [
    {
      name: 'PLA',
      shortDesc: 'Екологічний, біорозкладний',
      color: '#7ec8a3',
      img: '/images/materials/pla.jpg',
      characteristics: {
        temperature: '190-220°C',
        strength: 'Середня',
        flexibility: 'Низька',
        durability: 'Середня',
      },
      applications: 'Іграшки, декор, прототипи, навчальні моделі',
      longDesc: 'PLA (полілактид) – найпопулярніший матеріал для 3D-друку. Виготовляється з кукурудзяного крохмалю, тому є екологічним та біорозкладним. Ідеальний для початківців завдяки легкості друку та відсутності запаху.',
    },
    {
      name: 'ABS',
      shortDesc: 'Міцний, ударостійкий',
      color: '#c9a84c',
      img: '/images/materials/abs.jpg',
      characteristics: {
        temperature: '220-250°C',
        strength: 'Висока',
        flexibility: 'Середня',
        durability: 'Висока',
      },
      applications: 'Функціональні деталі, корпуси, шестерні, автомобільні компоненти',
      longDesc: 'ABS (акрилонітрил-бутадієн-стирол) – міцний та ударностійкий пластик. Витримує високі навантаження та температури. Потребує закритої камери та гарної вентиляції через легкий запах при друку.',
    },
    {
      name: 'PETG',
      shortDesc: 'Універсальний, хімічно стійкий',
      color: '#2d5a4b',
      img: '/images/materials/petg.jpg',
      characteristics: {
        temperature: '230-250°C',
        strength: 'Висока',
        flexibility: 'Середня',
        durability: 'Висока',
      },
      applications: 'Харчові контейнери, технічні вироби, медичні пристрої, зовнішні деталі',
      longDesc: 'PETG (поліетилентерефталат гліколь) – поєднує міцність ABS та легкість друку PLA. Стійкий до хімічних речовин та вологи. Безпечний для контакту з їжею. Не має запаху при друку.',
    },
    {
      name: 'TPU',
      shortDesc: 'Гнучкий, еластичний',
      color: '#b0b0b0',
      img: '/images/materials/tpu.jpg',
      characteristics: {
        temperature: '210-230°C',
        strength: 'Середня',
        flexibility: 'Дуже висока',
        durability: 'Висока',
      },
      applications: 'Ущільнювачі, чохли, прокладки, амортизатори, гнучкі з\'єднання',
      longDesc: 'TPU (термопластичний поліуретан) – еластичний та гнучкий матеріал, схожий на гуму. Витримує багаторазові згинання та розтягування. Ідеальний для виробів, які потребують амортизації або герметизації.',
    },
    {
      name: 'ASA',
      shortDesc: 'Стійкий до УФ, погоди',
      color: '#f59e0b',
      img: '/images/materials/asa.jpg',
      characteristics: {
        temperature: '240-260°C',
        strength: 'Висока',
        flexibility: 'Середня',
        durability: 'Дуже висока',
      },
      applications: 'Зовнішні деталі, автомобільні компоненти, вуличні конструкції',
      longDesc: 'ASA (акрилонітрил-стирол-акрилат) – має всі переваги ABS, але значно стійкіший до ультрафіолету та погодних умов. Не жовтіє на сонці, ідеальний для виробів, що використовуються на відкритому повітрі.',
    },
    {
      name: 'PA (нейлон)',
      shortDesc: 'Дуже міцний, зносостійкий',
      color: '#8b5cf6',
      img: '/images/materials/pa.jpg',
      characteristics: {
        temperature: '250-280°C',
        strength: 'Дуже висока',
        flexibility: 'Середня',
        durability: 'Дуже висока',
      },
      applications: 'Шестерні, підшипники, механічні деталі, інженерні прототипи',
      longDesc: 'PA (нейлон) – надміцний інженерний пластик з високою зносостійкістю та низьким коефіцієнтом тертя. Витримує великі навантаження та високі температури. Використовується для функціональних деталей, що зазнають тертя.',
    },
  ];

  // Використовуємо дані з пропса, якщо вони є, інакше – дефолтні
  const materialsData = data && data.length > 0 ? data : defaultMaterials;

  const toggleMaterial = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-[#1a3c34]">Матеріали</h2>
          <p className="text-gray-600 text-lg">
            Натисніть на картку, щоб дізнатися більше
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialsData.map((m, idx) => {
            const isActive = activeIndex === idx;
            const isHovered = hoveredIndex === idx;
            const isOther = activeIndex !== null && activeIndex !== idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{
                  opacity: isOther ? 0.3 : 1,
                  scale: isOther ? 0.95 : 1,
                  y: isOther ? 0 : 0,
                }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div
                  className={`relative w-full cursor-pointer bg-white p-5 rounded-2xl shadow-md border-t-4 transition-all ${
                    isActive ? 'ring-2 ring-[#c9a84c] shadow-lg' : ''
                  }`}
                  style={{ borderTopColor: m.color || '#ccc' }}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    y: isActive ? -4 : 0,
                  }}
                  transition={{ type: 'spring', damping: 20 }}
                  onClick={() => toggleMaterial(idx)}
                >
                  {/* Фото збільшеної висоти */}
                  <div className="relative w-full h-56 mb-3 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={m.img || '/images/materials/placeholder.jpg'}
                      alt={m.name}
                      fill
                      className="object-cover transition duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      style={{
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity"
                      style={{ opacity: isHovered ? 1 : 0 }}
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#1a3c34]">
                      3D-друк
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#1a3c34]">{m.name}</h3>
                      <p className="text-gray-500 text-sm">{m.shortDesc}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl text-[#c9a84c]"
                    >
                      {isActive ? '✕' : '▼'}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, type: 'spring', damping: 25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          <p className="text-gray-600 text-sm">{m.longDesc}</p>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-xs text-gray-400">Температура</p>
                              <p className="text-sm font-medium text-gray-700">
                                {m.characteristics?.temperature || '—'}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-xs text-gray-400">Міцність</p>
                              <p className="text-sm font-medium text-gray-700">
                                {m.characteristics?.strength || '—'}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-xs text-gray-400">Гнучкість</p>
                              <p className="text-sm font-medium text-gray-700">
                                {m.characteristics?.flexibility || '—'}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-xs text-gray-400">Довговічність</p>
                              <p className="text-sm font-medium text-gray-700">
                                {m.characteristics?.durability || '—'}
                              </p>
                            </div>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-green-700 font-medium">Застосування</p>
                            <p className="text-sm text-gray-700">{m.applications || '—'}</p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveIndex(null);
                            }}
                            className="w-full py-2 text-sm font-medium text-[#1a3c34] bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            Закрити
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}