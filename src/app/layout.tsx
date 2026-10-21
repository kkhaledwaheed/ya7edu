import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { LMSProvider } from '@/context/lms-context';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'YA7EDU | منصة الثانوية العامة الذكية وكروت الشحن',
  description: 'المنصة التعليمية الرائدة لطلاب الثانوية العامة (أولى، تانية، وتالتة ثانوي). كبرى المعلمين، المذكرات الحصرية، وكروت الشحن الفورية.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
        <LMSProvider>
          {children}
        </LMSProvider>
      </body>
    </html>
  );
}
