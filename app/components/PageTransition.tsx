'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 頁面切換時重置動畫
    // 使用 setTimeout 避免在 effect 中同步調用 setState
    const timer1 = setTimeout(() => {
      setIsVisible(false);
    }, 0);
    
    const timer2 = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

