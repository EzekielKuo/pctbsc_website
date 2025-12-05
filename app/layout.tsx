import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './theme/ThemeRegistry';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '大專聖經神學研究班 - 校園福音團契',
  description: '大專聖經神學研究班營會網站，提供報名資訊、營會介紹、FAQ等相關資訊',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
