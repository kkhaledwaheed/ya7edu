import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { LMSProvider } from '@/context/lms-context';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'YA7EDU | المنظومة التعليمية الرقمية الذكية وحوكمة السناتر 2026',
  description: 'منظومة LMS الرقمية الأكثر تقدماً لطلاب ومعلمي الثانوية العامة. حوكمة نتائج الامتحانات، كروت شحن السناتر الفورية، مذكرات الشرح التفاعلية وحصص المعاينة المجانية.',
  keywords: ['منصة ثانوية عامة', 'YA7EDU', 'امتحانات ثانوية عامة', 'كروت شحن سناتر', 'مذكرات أوائل', 'حصص مجانية'],
  authors: [{ name: 'YA7EDU Digital Learning Systems' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} antialiased selection:bg-blue-600 selection:text-white`}>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans text-right">
        <LMSProvider>
          {children}
        </LMSProvider>
      </body>
    </html>
  );
}
