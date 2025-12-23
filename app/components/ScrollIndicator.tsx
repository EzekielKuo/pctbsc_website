'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Box, IconButton, Fade } from '@mui/material';

export default function ScrollIndicator() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 只在接近頂部或底部時顯示按鈕
      const nearTop = scrollTop <= 200;
      const nearBottom = scrollTop >= documentHeight - windowHeight - 200;
      setShowTop(nearTop);
      setShowBottom(nearBottom);
    };

    handleScroll(); // 初始檢查
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
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
      {/* 向上滾動按鈕 */}
      <Fade in={showTop}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            zIndex: 1000,
            display: showTop ? 'block' : 'none',
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(10px)',
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
      </Fade>

      {/* 向下滾動按鈕 */}
      <Fade in={showBottom}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            display: showBottom ? 'block' : 'none',
          }}
        >
          <IconButton
            onClick={scrollToBottom}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              backdropFilter: 'blur(10px)',
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
      </Fade>
    </>
  );
}

