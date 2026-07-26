'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/forms/FileUpload';

type PaymentMethod = {
  id: string;
  recipientName: string;
  iban: string;
  bankName: string;
  paymentPurpose: string;
  edrpou?: string;
  accountNumber?: string;
  qrCode?: string; // Додаємо поле для QR-коду
};

export default function AdminPayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      recipientName: 'ФОП Комарницький Юрій',
      iban: 'UA123456789012345678901234567',
      bankName: 'Монобанк',
      paymentPurpose: 'Оплата за 3D-друк, замовлення №',
      edrpou: '1234567890',
      qrCode: '',
    },
  ]);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to fetch');
      const items = await res.json();
      const paymentItem = items.find((item: any) => item.key === 'payment_details');
      if (paymentItem?.data) {
        if (Array.isArray(paymentItem.data)) {
          setMethods(paymentItem.data);
        } else if (typeof paymentItem.data === 'object' && paymentItem.data !== null) {
          const old = paymentItem.data;
          setMethods([
            {
              id: '1',
              recipientName: old.recipientName || 'ФОП Комарницький Юрій',
              iban: old.iban || 'UA123456789012345678901234567',
              bankName: old.bankName || 'Монобанк',
              paymentPurpose: old.paymentPurpose || 'Оплата за 3D-друк, замовлення №',
              edrpou: old.edrpou || '1234567890',
              qrCode: old.qrCode || '',
            },
          ]);
        }
      }
    } catch (err) {
      setError('Не вдалося завантажити реквізити');
    } finally {
      setLoading(false);
    }
  };

  const addMethod = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      recipientName: '',
      iban: '',
      bankName: '',
      paymentPurpose: '',
      edrpou: '',
      qrCode: '',
    };
    setMethods([...methods, newMethod]);
  };

  const removeMethod = (id: string) => {
    if (methods.length <= 1) {
      alert('Має бути хоча б один набір реквізитів');
      return;
    }
    setMethods(methods.filter(m => m.id !== id));
  };

  const handleChange = (id: string, field: keyof PaymentMethod, value: string) => {
    setMethods(methods.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleQrUpload = async (file: File | null, id: string) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.fileUrl) {
        setMethods(methods.map(m => 
          m.id === id ? { ...m, qrCode: data.fileUrl } : m
        ));
      }
    } catch (err) {
      alert('Помилка завантаження QR-коду');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const m of methods) {
      if (!m.recipientName.trim() || !m.iban.trim() || !m.bankName.trim()) {
        alert(`Заповніть всі обов'язкові поля для "${m.recipientName || 'нового'}" реквізиту`);
        return;
      }
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'payment_details', data: methods }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      setError('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Завантаження...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Реквізити для оплати (IBAN)</h1>
        <button
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-[#1a3c34] transition"
        >
          ← На головну
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {methods.map((method, index) => (
            <div
              key={method.id}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50 space-y-4 relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#1a3c34]">Реквізит #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeMethod(method.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Видалити
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Отримувач (ПІБ) *</label>
                <input
                  type="text"
                  value={method.recipientName}
                  onChange={(e) => handleChange(method.id, 'recipientName', e.target.value)}
                  className="w-full p-3 text-base bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IBAN *</label>
                <input
                  type="text"
                  value={method.iban}
                  onChange={(e) => handleChange(method.id, 'iban', e.target.value)}
                  className="w-full p-3 text-base bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва банку *</label>
                <input
                  type="text"
                  value={method.bankName}
                  onChange={(e) => handleChange(method.id, 'bankName', e.target.value)}
                  className="w-full p-3 text-base bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ЄДРПОУ / РНОКПП (необов'язково)</label>
                <input
                  type="text"
                  value={method.edrpou || ''}
                  onChange={(e) => handleChange(method.id, 'edrpou', e.target.value)}
                  className="w-full p-3 text-base bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Призначення платежу (необов'язково)</label>
                <textarea
                  value={method.paymentPurpose || ''}
                  onChange={(e) => handleChange(method.id, 'paymentPurpose', e.target.value)}
                  rows={3}
                  className="w-full p-3 text-base bg-white rounded-lg border border-gray-200 focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/30 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">QR-код (необов'язково)</label>
                {method.qrCode && (
                  <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={method.qrCode} alt="QR-код" className="w-full h-full object-contain" />
                  </div>
                )}
                <FileUpload
                  onFileSelect={(file) => handleQrUpload(file, method.id)}
                  accept=".jpg,.jpeg,.png,.webp,.svg"
                  allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'svg']}
                  maxSize={5 * 1024 * 1024}
                  label={method.qrCode ? 'Замінити QR-код' : 'Завантажити QR-код'}
                />
                {uploading && <p className="text-sm text-blue-500 mt-1">Завантаження...</p>}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMethod}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            + Додати ще реквізити
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">✅ Реквізити збережено!</p>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition disabled:opacity-50"
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}