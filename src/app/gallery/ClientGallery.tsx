'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientGallery() {
  const [isExpanded, setIsExpanded] = useState(false);

  const sites = [
    { name: 'Printables.com', url: 'https://www.printables.com/model', icon: '🖨️' },
    { name: 'Thingiverse', url: 'https://www.thingiverse.com/', icon: '🌐' },
    { name: 'Cults3D', url: 'https://cults3d.com/', icon: '🎨' },
  ];

  return (
    <div className="text-center mt-16">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-[#1a3c34] to-[#2d5a4b] shadow-lg shadow-[#1a3c34]/30 hover:shadow-[#1a3c34]/50 transition-all duration-300 hover:scale-105"
      >
        🌐 Більше 3D-моделей
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2 inline-block"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {sites.map((site, idx) => (
                <motion.a
                  key={idx}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#c9a84c] hover:shadow-lg transition-all duration-200 text-[#1a3c34] font-medium"
                >
                  <span className="text-2xl">{site.icon}</span>
                  {site.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}