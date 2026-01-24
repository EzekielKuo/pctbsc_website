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
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
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

