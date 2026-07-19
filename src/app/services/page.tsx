import { supabaseAdmin } from '@/lib/supabase/server';
import ServiceCard from '@/components/ui/ServiceCard';
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
            <ServiceCard key={service.id} service={service} />
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