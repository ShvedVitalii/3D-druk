import { supabaseAdmin } from '@/lib/supabase/server';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPrinters() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'printers')
    .single();
  return data?.data || [];
}

export default async function PrinterPage() {
  const printers = await getPrinters();
  // Фільтруємо приховані
  const visiblePrinters = printers.filter((p: any) => !p.hidden);
  const flagship = visiblePrinters.find((p: any) => p.featured);
  const others = visiblePrinters.filter((p: any) => !p.featured);

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto overflow-hidden">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] text-sm font-semibold mb-3">
          🖨️ Наше обладнання
        </span>
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">
          Принтери Bambu Lab
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Сучасні 3D-принтери для професійного та домашнього використання
        </p>
      </div>

      {flagship && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={flagship.img}
                alt={flagship.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                {flagship.tag}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-[#1a3c34]">{flagship.name}</h2>
              <p className="text-gray-600 mt-2">{flagship.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {flagship.specs?.map((spec: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{spec.label}</p>
                    <p className="font-semibold text-[#1a3c34] text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-4">
                <Button href="/order" variant="primary">Замовити друк</Button>
                <Button href="/gallery" variant="secondary">Дивитись роботи</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-[#1a3c34] text-center mb-8">Інші моделі Bambu Lab</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {others.map((printer: any, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:border-[#c9a84c] flex flex-col h-full"
          >
            <div className="relative h-48 bg-gray-100 flex-shrink-0">
              <Image
                src={printer.img}
                alt={printer.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#1a3c34]">
                {printer.tag}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1a3c34]">{printer.name}</h3>
              <p className="text-gray-500 text-sm mt-1 flex-1">{printer.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {printer.specs?.slice(0, 4).map((spec: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-[10px] text-gray-400 uppercase">{spec.label}</p>
                    <p className="text-xs font-semibold text-[#1a3c34]">{spec.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button href="/order" variant="primary" className="w-full text-sm py-2">
                  Замовити друк
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {others.length === 0 && !flagship && (
        <div className="text-center py-12 text-gray-400">Принтерів поки немає</div>
      )}

      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm mb-4">Готові замовити друк на одному з цих принтерів?</p>
        <Button href="/order" variant="primary" className="text-lg px-10 py-4">
          Перейти до замовлення
        </Button>
      </div>
    </div>
  );
}