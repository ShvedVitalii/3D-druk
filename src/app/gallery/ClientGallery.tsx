'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ExternalLink = {
  id: string;
  name: string;
  url: string;
  icon: string;
};

export default function ClientGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch');
        const items = await res.json();
        const linkItem = items.find((item: any) => item.key === 'external_links');
        if (linkItem?.data && Array.isArray(linkItem.data) && linkItem.data.length > 0) {
          setLinks(linkItem.data);
        } else {
          setLinks([
            { id: '1', name: 'Printables.com', url: 'https://www.printables.com/model', icon: '🖨️' },
            { id: '2', name: 'Thingiverse', url: 'https://www.thingiverse.com/', icon: '🌐' },
            { id: '3', name: 'Cults3D', url: 'https://cults3d.com/', icon: '🎨' },
          ]);
        }
      } catch (err) {
        console.error('Помилка завантаження зовнішніх посилань:', err);
        setLinks([
          { id: '1', name: 'Printables.com', url: 'https://www.printables.com/model', icon: '🖨️' },
          { id: '2', name: 'Thingiverse', url: 'https://www.thingiverse.com/', icon: '🌐' },
          { id: '3', name: 'Cults3D', url: 'https://cults3d.com/', icon: '🎨' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  if (loading) return null;

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
              {links.map((site, idx) => (
                <motion.a
                  key={site.id || idx}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#c9a84c] hover:shadow-lg transition-all duration-200 text-[#1a3c34] font-medium"
                >
                  <span className="text-2xl">{site.icon || '🔗'}</span>
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