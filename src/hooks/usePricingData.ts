'use client';

import { useEffect, useState } from 'react';

type PricingItem = {
  label: string;
  value: string;
};

type PricingBlock = {
  title: string;
  icon: string;
  items: PricingItem[];
  footer: string;
  action: string | null;
};

type MaterialPrice = {
  name: string;
  pricePerGram: number;
};

export function usePricingData() {
  const [data, setData] = useState<PricingBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch('/api/admin/content');
        if (!res.ok) throw new Error('Failed to fetch pricing data');
        const items = await res.json();
        const pricingItem = items.find((item: any) => item.key === 'pricing');
        if (pricingItem?.data && Array.isArray(pricingItem.data) && pricingItem.data.length > 0) {
          setData(pricingItem.data);
        } else {
          // Дефолтні значення, якщо в базі порожньо або немає даних
          setData([
            {
              title: 'Орієнтовні ціни',
              icon: '💰',
              items: [
                { label: 'PLA', value: 'від 6 грн/г' },
                { label: 'PETG', value: 'від 7 грн/г' },
                { label: 'ABS', value: 'від 7 грн/г' },
                { label: 'ASA', value: 'від 8 грн/г' },
                { label: 'TPU', value: 'від 10 грн/г' },
                { label: 'PA (нейлон)', value: 'від 15 грн/г' },
              ],
              footer: '*Точна ціна після узгодження моделі',
              action: 'Розрахувати вартість',
            },
            {
              title: 'Доставка',
              icon: '🚚',
              items: [
                { label: 'Нова Пошта', value: '1-3 дні' },
                { label: 'Укрпошта', value: '2-5 днів' },
                { label: 'Самовивіз', value: 'Стрий' },
              ],
              footer: 'Вартість згідно з тарифами перевізника',
              action: null,
            },
            {
              title: 'Гарантії та акції',
              icon: '✅',
              items: [
                { label: 'Якість', value: 'Перевірка кожного виробу' },
                { label: 'Заміна', value: 'Безкоштовно при браку' },
                { label: 'Консультація', value: 'Перед друком' },
                { label: 'Акція', value: 'від 10 шт. – знижка 5%' },
              ],
              footer: 'Повернення браку – при відеофіксації розпаковки',
              action: null,
            },
          ]);
        }
      } catch (err) {
        setError('Помилка завантаження цін');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, []);

  // Отримати ціну матеріалу за назвою (з першого блоку)
  const getMaterialPrice = (materialName: string): number => {
    const pricingBlock = data[0];
    if (!pricingBlock) return 6; // дефолтна ціна
    const item = pricingBlock.items.find(
      (i) => i.label.toLowerCase() === materialName.toLowerCase()
    );
    if (!item) return 6;
    const match = item.value.match(/(\d+)/);
    return match ? parseInt(match[1]) : 6;
  };

  // Отримати список всіх матеріалів з цінами (з першого блоку)
  const getMaterialsList = (): MaterialPrice[] => {
    const pricingBlock = data[0];
    if (!pricingBlock) return [];
    return pricingBlock.items.map((item) => {
      const match = item.value.match(/(\d+)/);
      const price = match ? parseInt(match[1]) : 6;
      return { name: item.label, pricePerGram: price };
    });
  };

  return { data, loading, error, getMaterialPrice, getMaterialsList };
}