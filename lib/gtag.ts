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
    dataLayer: unknown[];
  }
}

// 頁面瀏覽追蹤（傳入 page_title 讓 GA4「網頁標題」報表能依頁面區分）
export const pageview = (url: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID || '', {
      page_path: url,
      ...(pageTitle != null && pageTitle !== '' && { page_title: pageTitle }),
    });
  }
};

// 事件追蹤（可傳入額外參數，例如 page_path 以便在 GA4 依頁面區分）
export const event = (
  {
    action,
    category,
    label,
    value,
  }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
  },
  extra?: Record<string, string | number | boolean | undefined>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const params: Record<string, unknown> = {
      event_category: category,
      event_label: label,
      value: value,
    };
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => {
        if (v !== undefined) params[k] = v;
      });
    }
    window.gtag('event', action, params);
  }
};

// 設定使用者 ID（用於追蹤登入用戶）
export const setUserId = (userId: string | null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    if (userId) {
      window.gtag('config', GA_MEASUREMENT_ID || '', {
        user_id: userId,
      });
    } else {
      // 清除使用者 ID
      window.gtag('config', GA_MEASUREMENT_ID || '', {
        user_id: null,
      });
    }
  }
};

