import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';

async function getContentKeys() {
  const { data } = await supabaseAdmin.from('content').select('key');
  return data?.map(item => item.key) || [];
}

export default async function AdminContentPage() {
  const keys = await getContentKeys();

  // Сортуємо для зручності
  const sortedKeys = keys.sort();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a3c34]">Управління контентом</h1>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-[#1a3c34] transition">
            ← Назад
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedKeys.map((key) => (
            <Link
              key={key}
              href={`/admin/content/${key}`}
              className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:border-[#c9a84c] transition flex items-center justify-between group"
            >
              <span className="font-medium text-[#1a3c34] capitalize">{key}</span>
              <span className="text-[#c9a84c] opacity-0 group-hover:opacity-100 transition">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}