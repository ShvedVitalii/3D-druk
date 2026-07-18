import { supabaseAdmin } from '@/lib/supabase/server';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Materials from '@/components/home/Materials';
import Process from '@/components/home/Process';
import Pricing from '@/components/home/Pricing';
import GalleryPreview from '@/components/home/GalleryPreview';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Contact from '@/components/home/Contact';
import FinalCTA from '@/components/home/FinalCTA';

async function getContent() {
  const { data } = await supabaseAdmin.from('content').select('key, data');
  if (!data) return {};
  return data.reduce((acc, item) => ({ ...acc, [item.key]: item.data }), {});
}

export default async function Home() {
  const content = await getContent();

  return (
    <div className="overflow-hidden">
      <Hero data={content.hero} />
      <Features data={content.features} />
      <Materials data={content.materials} />
      <Process data={content.process} />
      <Pricing data={content.pricing} />
      <GalleryPreview data={content.gallery} />
      <Testimonials data={content.testimonials} />
      <FAQ data={content.faq} />
      <Contact data={content.contacts} />
      <FinalCTA data={content.finalCTA} />
    </div>
  );
}