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
  title: '63神研班-2026大專聖經神學研究班',
  description: '歡迎來到 63 神研班！，提供活動簡介、前輩訪談及報名資訊。透過閱讀聖經與全台大專青年一同成長。',
  keywords: [
    '神研班', 
    '大專聖經神學研究班', 
    'PCT', 
    '台灣基督長老教會',
    '第 63 屆神研班報名',
    '神研班訪談',
    '聖經研究營隊',
    '長老教會大專生活動',
    '台灣基督長老教會營隊'
  ],
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: '63神研班-2026大專聖經神學研究班',
    description: '歡迎來到 63 神研班！，提供活動簡介、前輩訪談及報名資訊。透過閱讀聖經與全台大專青年一同成長。',
    url: 'https://pctbsc-website.vercel.app/',
    siteName: '神研班官網',
    images: [
      {
        url: 'https://pctbsc-website.vercel.app/logo.jpg',
        width: 512,
        height: 512,
        alt: '63神研班 Logo - 台灣基督長老教會',
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ backgroundColor: '#534963' }}>
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
