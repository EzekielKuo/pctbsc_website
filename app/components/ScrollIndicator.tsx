'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Box, IconButton } from '@mui/material';

export default function ScrollIndicator() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, documentHeight - windowHeight);

      // 檢查是否在頂部或底部（使用 5px 作為緩衝區，避免浮點數誤差）
      const isAtTop = scrollTop <= 5;
      // 只有在頁面可以滾動時才檢查是否在底部
      const isAtBottom = maxScroll > 0 && scrollTop >= maxScroll - 5;
      
      // 向上按鈕：只在底部時顯示（往上滾動）
      // 向下按鈕：只在頂部時顯示（往下滾動）
      setShowTop(isAtBottom && !isAtTop);
      setShowBottom(isAtTop && !isAtBottom);
    };

    // 使用 setTimeout 確保 DOM 已完全載入
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {/* 向上滾動按鈕 - 只在底部時顯示 */}
      {showTop && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <ChevronUp size={24} />
          </IconButton>
        </Box>
      )}

      {/* 向下滾動按鈕 - 只在頂部時顯示 */}
      {showBottom && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToBottom}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <ChevronDown size={24} />
          </IconButton>
        </Box>
      )}
    </>
  );
}

