import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
// 重要：globals.css 必須在 ThemeRegistry 之前導入
// 這樣 Tailwind 樣式會後載入，優先級高於 MUI
import './globals.css';
import ThemeRegistry from './theme/ThemeRegistry';
import GoogleAnalytics from './components/GoogleAnalytics';
import PageViewTracker from './components/PageViewTracker';
import PageTimeTracker from './components/PageTimeTracker';
import ScrollDepthTracker from './components/ScrollDepthTracker';
import PageLoadTimeTracker from './components/PageLoadTimeTracker';
import UserIdTracker from './components/UserIdTracker';
import PageTransition from './components/PageTransition';
import ScrollIndicator from './components/ScrollIndicator';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '大專聖經神學研究班',
  description: '大專聖經神學研究班營會網站，提供報名資訊、營會介紹、FAQ等相關資訊',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ backgroundColor: '#000000' }}>
        <GoogleAnalytics />
        <PageViewTracker />
        <PageTimeTracker />
        <ScrollDepthTracker />
        <PageLoadTimeTracker />
        <UserIdTracker />
        <Providers>
          <ThemeRegistry>
            <PageTransition>{children}</PageTransition>
            <ScrollIndicator />
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}
