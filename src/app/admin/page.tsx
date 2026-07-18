import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/admin/DeleteButton';

// Мапа українських назв
const blockNames: Record<string, string> = {
  hero: 'Головний банер',
  features: 'Чому обирають нас?',
  materials: 'Матеріали',
  process: 'Як ми працюємо',
  pricing: 'Вартість та доставка',
  testimonials: 'Відгуки',
  faq: 'Часті запитання',
  finalCTA: 'Готові втілити ідею?',
};

async function getContentItems() {
  const { data } = await supabaseAdmin.from('content').select('key, data');
  return data || [];
}

async function deleteContentKey(key: string) {
  'use server';
  await supabaseAdmin.from('content').delete().eq('key', key);
  revalidatePath('/admin');
}

export default async function AdminDashboard() {
  const items = await getContentItems();

  // Виключаємо службові ключі, які будуть в інших розділах
  const excludeKeys = ['services', 'printers', 'gallery', 'contacts'];
  const blocks = items.filter(item => !excludeKeys.includes(item.key));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1a3c34]">Управління контентом головної сторінки</h1>
        <Link
          href="/admin/content/new"
          className="px-4 py-2 bg-[#1a3c34] text-white rounded-lg hover:bg-[#2d5a4b] transition"
        >
          + Створити блок
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {blocks.map((item) => {
          const data = item.data || {};
          const name = blockNames[item.key] || item.key;
          return (
            <div key={item.key} className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-[#1a3c34]">{name}</h2>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/content/${item.key}`}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    Редагувати
                  </Link>
                  <DeleteButton deleteAction={deleteContentKey.bind(null, item.key)} name={name} />
                </div>
              </div>

              {/* Прев'ю даних */}
              <div className="mt-4 text-sm text-gray-600">
                {typeof data === 'object' && !Array.isArray(data) && data !== null ? (
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(data).slice(0, 4).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="font-medium">{k}:</span>
                        <span>{typeof v === 'string' ? v : JSON.stringify(v).slice(0, 50)}</span>
                      </div>
                    ))}
                    {Object.keys(data).length > 4 && <div className="col-span-2 text-gray-400">...</div>}
                  </div>
                ) : Array.isArray(data) ? (
                  <div>
                    {data.slice(0, 3).map((el, idx) => (
                      <div key={idx} className="border-b border-gray-100 py-1">
                        {typeof el === 'object' ? (
                          <span>{el.title || el.name || `Елемент ${idx+1}`}</span>
                        ) : (
                          <span>{String(el)}</span>
                        )}
                      </div>
                    ))}
                    {data.length > 3 && <div className="text-gray-400">... ще {data.length - 3} елементів</div>}
                  </div>
                ) : (
                  <div>{String(data)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}