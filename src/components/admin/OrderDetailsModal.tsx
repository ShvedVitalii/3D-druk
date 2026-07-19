'use client';

import { motion } from 'framer-motion';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const handleDownload = (fileUrl: string) => {
    if (fileUrl) {
      window.open(`/uploads/${fileUrl}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#1a3c34]">Деталі замовлення</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Клієнт</p>
              <p className="font-medium">{order.customer?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Телефон</p>
              <p className="font-medium">{order.customer?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{order.customer?.email || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Коментар</p>
              <p className="font-medium">{order.customer?.comment || '—'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Доставка</p>
            <p className="font-medium">
              {order.delivery?.type === 'nova' ? 'Нова Пошта' :
               order.delivery?.type === 'ukr' ? 'Укрпошта' : 'Самовивіз'}
            </p>
            {order.delivery?.city && <p className="text-sm">Місто: {order.delivery.city}</p>}
            {order.delivery?.warehouse && <p className="text-sm">Відділення: {order.delivery.warehouse}</p>}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Товари</p>
            <ul className="list-disc pl-4">
              {order.items?.map((item: any, idx: number) => (
                <li key={idx} className="text-sm">
                  {item.title} — {item.quantity} шт. × {item.price} ₴
                  {item.options && Object.keys(item.options).length > 0 && (
                    <span className="text-gray-500"> ({Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(', ')})</span>
                  )}
                  {item.file && (
                    <button
                      onClick={() => handleDownload(item.file)}
                      className="ml-2 text-blue-500 hover:underline text-xs"
                    >
                      📎 Завантажити файл
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold mt-2">Загальна сума: {order.total} ₴</p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Статус</p>
            <p className={`font-medium ${order.status === 'pending' ? 'text-yellow-600' : order.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
              {order.status === 'pending' ? 'Очікування' :
               order.status === 'accepted' ? 'Прийнято' :
               order.status === 'rejected' ? 'Відхилено' : 'Надіслано'}
            </p>
            <p className="text-sm text-gray-400">Дата: {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition">
            Закрити
          </button>
        </div>
      </motion.div>
    </div>
  );
}