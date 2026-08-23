import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3001'),
  title: 'oh my coffee — Aiden brew log',
  description: 'Fellow Aiden 레시피를 기록하고 한 변수씩 개선하는 개인용 브루 로그',
  openGraph: {
    title: 'oh my coffee — Aiden brew log',
    description: 'Fellow Aiden 레시피를 기록하고 한 변수씩 개선하는 개인용 브루 로그',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'oh my coffee — Aiden brew log' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oh my coffee — Aiden brew log',
    description: 'Fellow Aiden 레시피를 기록하고 한 변수씩 개선하는 개인용 브루 로그',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
