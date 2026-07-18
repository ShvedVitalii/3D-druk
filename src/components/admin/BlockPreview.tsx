'use client';

import React from 'react';

interface BlockPreviewProps {
  key: string;
  data: any;
}

export default function BlockPreview({ key, data }: BlockPreviewProps) {
  if (!data) return <div className="text-gray-400">Немає даних для прев'ю</div>;

  switch (key) {
    case 'features':
      return <FeaturesPreview data={data} />;
    case 'materials':
      return <MaterialsPreview data={data} />;
    // Додати інші блоки пізніше
    default:
      return (
        <div className="text-gray-400">
          Прев'ю для блоку "{key}" поки не реалізовано
        </div>
      );
  }
}

// ==== ПРЕВ'Ю ДЛЯ FEATURES ====
function FeaturesPreview({ data }: { data: any[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-400">Немає елементів</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
      {data.map((feature, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${feature.color || 'bg-gray-200'} flex items-center justify-center text-2xl flex-shrink-0`}>
              {feature.icon || '📌'}
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.shortDesc}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{feature.longDesc}</p>
        </div>
      ))}
    </div>
  );
}

// ==== ПРЕВ'Ю ДЛЯ MATERIALS ====
function MaterialsPreview({ data }: { data: any[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-gray-400">Немає матеріалів</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
      {data.map((material, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={material.img || '/images/materials/placeholder.jpg'} alt={material.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{material.name}</h4>
              <p className="text-sm text-gray-500">{material.shortDesc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}