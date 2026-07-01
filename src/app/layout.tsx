import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';
import AIConsultant from '@/components/ui/AIConsultant';

export const metadata: Metadata = {
  title: '3D-друк на замовлення | Сучасні вироби з пластику',
  description: 'Професійний 3D-друк іграшок, прототипів, деталей для ЗСУ. Розрахунок за 15 хвилин. Доставка по всій Україні.',
  openGraph: {
    title: '3D-друк на замовлення',
    description: 'Якісний 3D-друк іграшок, прототипів, деталей для ЗСУ. Швидко, надійно, доступно.',
    type: 'website',
    locale: 'uk_UA',
    siteName: '3D-друк',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '3D-друк на замовлення',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D-друк на замовлення',
    description: 'Якісний 3D-друк іграшок, прототипів, деталей для ЗСУ. Швидко, надійно, доступно.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <AIConsultant />
      </body>
    </html>
  );
}