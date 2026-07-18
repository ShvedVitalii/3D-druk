import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';
import AIConsultant from '@/components/ui/AIConsultant';
import { supabaseAdmin } from '@/lib/supabase/server';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: '3D-друк на замовлення | Сучасні вироби з пластику',
  description: 'Професійний 3D-друк іграшок, прототипів, деталей для ЗСУ. Розрахунок за 15 хвилин. Доставка по всій Україні.',
  openGraph: {
    title: '3D-друк на замовлення',
    description: 'Якісний 3D-друк іграшок, прототипів, деталей для ЗСУ. Швидко, надійно, доступно.',
    type: 'website',
    locale: 'uk_UA',
    siteName: '3D-друк',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '3D-друк на замовлення' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D-друк на замовлення',
    description: 'Якісний 3D-друк іграшок, прототипів, деталей для ЗСУ. Швидко, надійно, доступно.',
    images: ['/og-image.jpg'],
  },
};

async function getContacts() {
  const { data } = await supabaseAdmin
    .from('content')
    .select('data')
    .eq('key', 'contacts')
    .single();
  return data?.data || null;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contacts = await getContacts();

  return (
    <html lang="uk">
      <body>
        <SessionProviderWrapper>
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer contacts={contacts} />
          <AIConsultant />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}