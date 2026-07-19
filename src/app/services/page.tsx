import { supabaseAdmin } from '@/lib/supabase/server';
import ContactButton from '@/components/ui/ContactButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getServices() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'services')
    .single();
  return data?.data || [];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="pt-32 pb-20 container-custom max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-[#1a3c34] font-heading text-4xl md:text-5xl font-bold">Наші послуги</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-2">
          Професійний 3D-друк, дизайн, моделювання та багато іншого
        </p>
        <div className="mt-4 inline-block bg-gray-100 px-6 py-2 rounded-full text-sm text-gray-700 border border-gray-200">
          📐 Макс. розмір моделі: 25,6 × 25,6 × 25,6 см
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services
          .filter((s: any) => !s.hidden)
          .map((service: any) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl border border-gray-100/80 transition-all duration-300 hover:border-gray-200 hover:shadow-xl flex flex-col overflow-hidden"
            >
              <div
                className="h-0.5 w-full transition-all duration-300 group-hover:h-1"
                style={{ backgroundColor: service.categoryColor }}
              />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-[#c9a84c]/5 transition">
                    {service.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: service.categoryColor }}
                      >
                        {service.category}
                      </span>
                      {service.hasCalculator && (
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          🧮
                        </span>
                      )}
                      {service.hasFileUpload !== false && (
                        <span className="text-[10px] text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                          📎
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-[#1a3c34] mt-1.5 leading-snug group-hover:text-[#c9a84c] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{service.description}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block">Ціна</span>
                    <span className="text-xl font-bold text-[#1a3c34] tracking-tight">
                      {service.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:border-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-200">
                      Детальніше
                    </button>
                    <button className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1a3c34] text-white hover:bg-[#2d5a4b] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1">
                      <span>🛒</span> {service.priceValue > 0 ? 'Купити' : 'Замовити'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-400">Послуг поки немає</div>
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm mb-4">Не знайшли потрібну послугу?</p>
        <ContactButton />
      </div>
    </div>
  );
}