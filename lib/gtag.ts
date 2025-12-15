// Google Analytics 4 事件追蹤工具函數

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// 宣告 gtag 函數類型
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string | object,
      config?: object
    ) => void;
    dataLayer: any[];
  }
}

// 頁面瀏覽追蹤
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID || '', {
      page_path: url,
    });
  }
};

// 事件追蹤
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

