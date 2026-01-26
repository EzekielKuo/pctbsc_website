'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';

const PAGE_TITLES: Record<string, string> = {
  '/': '首頁',
  '/join': '報名',
  '/bsc/theme': '神研班主題',
  '/bsc/info': '活動資訊',
  '/bsc/schedule': '活動日程表',
  '/bsc/questionnaire': '每日問卷',
  '/interview': '神研前輩訪談',
  '/interview/chen-nan-zhou': '第1-7屆｜陳南州牧師',
  '/interview/huang-chun-sheng': '第20屆後｜黃春生牧師',
  '/interview/huang-hsu-hui': '第50屆後｜黃敍慧姊妹',
  '/login': '登入',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? (pathname || '63神研班');
}

export default function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const pageTitle = getPageTitle(pathname);
      pageview(url, pageTitle);
    }
  }, [pathname, searchParams]);
}

