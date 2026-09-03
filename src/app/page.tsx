import { supabaseAdmin } from '@/lib/supabase/server';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Materials from '@/components/home/Materials';
import Process from '@/components/home/Process';
import Pricing from '@/components/home/Pricing';
import GalleryPreview from '@/components/home/GalleryPreview';
import Clients from '@/components/home/Clients';
import Partners from '@/components/home/Partners';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import FinalCTA from '@/components/home/FinalCTA';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Content = {
  hero?: any;
  features?: any[];
  materials?: any[];
  process?: any[];
  pricing?: any[];
  gallery?: any[];
  testimonials?: any[];
  faq?: any[];
  contacts?: any;
  finalCTA?: any;
};

async function getContent(): Promise<Content> {
  const { data } = await supabaseAdmin.from('content').select('key, data');
  if (!data) return {};
  return data.reduce<Content>((acc, item) => ({ ...acc, [item.key]: item.data }), {});
}

export default async function Home() {
  const content = await getContent();

  return (
    <div className="overflow-hidden">
      <Hero data={content.hero} />
      <GalleryPreview data={content.gallery} />
      <Features data={content.features} />
      <Materials data={content.materials} />
      <Process data={content.process} />
      <Pricing data={content.pricing} />
      <Clients />
      <Partners />
      <Testimonials data={content.testimonials} />
      <FAQ data={content.faq} />
      <Contact data={content.contacts} />
      <FinalCTA data={content.finalCTA} />
    </div>
  );
}