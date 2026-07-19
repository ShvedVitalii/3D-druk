'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: string;
  customer: any;
  delivery: any;
  items: any[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'sent';
  source: 'form' | 'cart';
  created_at: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError('Не вдалося завантажити заявки');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err) {
      alert('Помилка оновлення статусу');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це замовлення?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="text-center py-10">Завантаження...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1a3c34] mb-6">Заявки та замовлення</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'accepted', 'rejected', 'sent'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === status
                ? 'bg-[#1a3c34] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Всі' :
             status === 'pending' ? 'Очікування' :
             status === 'accepted' ? 'Прийнято' :
             status === 'rejected' ? 'Відхилено' : 'Надіслано'}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Клієнт</th>
                <th className="text-left p-4 font-semibold text-gray-600">Сума</th>
                <th className="text-left p-4 font-semibold text-gray-600">Джерело</th>
                <th className="text-left p-4 font-semibold text-gray-600">Статус</th>
                <th className="text-left p-4 font-semibold text-gray-600">Дата</th>
                <th className="text-right p-4 font-semibold text-gray-600">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-[#1a3c34]">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.phone}</div>
                      <div className="text-xs text-gray-400">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#1a3c34]">{order.total} ₴</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.source === 'cart' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.source === 'cart' ? 'Кошик' : 'Форма'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'pending' ? 'Очікування' :
                       order.status === 'accepted' ? 'Прийнято' :
                       order.status === 'rejected' ? 'Відхилено' : 'Надіслано'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      <option value="pending">Очікування</option>
                      <option value="accepted">Прийнято</option>
                      <option value="rejected">Відхилено</option>
                      <option value="sent">Надіслано</option>
                    </select>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Заявок немає</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}