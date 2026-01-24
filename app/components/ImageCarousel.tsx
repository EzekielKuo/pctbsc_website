'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Image as ImageIcon } from 'lucide-react';
import { event } from '@/lib/gtag';

interface ImageCarouselProps {
  images: string[];
  interval?: number; // 輪播間隔時間（毫秒），預設 10 秒
  height?: number | string; // 輪播高度
}

export default function ImageCarousel({
  images,
  interval = 10000,
  height = 400,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 重置計時器的函數
  const resetTimer = (isAuto: boolean = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          // 追蹤自動切換
          if (isAuto) {
            event({
              action: 'carousel_switch',
              category: 'carousel',
              label: 'auto',
              value: nextIndex + 1, // 圖片編號（從1開始）
            });
          }
          return nextIndex;
        });
      }, interval);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;

    resetTimer(true); // 初始化時使用自動切換

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval]);

  // 沒有照片時顯示黑色背景
  if (images.length === 0) {
    return (
      <Container maxWidth={false} disableGutters sx={{ pt: 0, pb: 4, mt: 0 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: typeof height === 'number' ? `${height}px` : height,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'black',
          }}
        />
      </Container>
    );
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    resetTimer(false); // 點擊原點時重置計時器（不追蹤自動切換）
    
    // 追蹤指示器點擊
    event({
      action: 'carousel_click',
      category: 'carousel',
      label: 'indicator',
      value: index + 1, // 圖片編號（從1開始）
    });
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ pt: 0, pb: 4, mt: 0 }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          className="carousel-container"
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'black',
            boxShadow: 2,
            minHeight: typeof height === 'number' ? `${height}px` : height,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: `${images.length * 100}%`,
              height: '100%',
              transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
              transition: 'transform 0.6s ease-in-out',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / images.length}%`,
                  height: '100%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`輪播圖片 ${index + 1}`}
                  className="carousel-image"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onLoad={(e) => {
                    // 動態調整容器高度以適應當前顯示的圖片
                    if (index === currentIndex) {
                      const img = e.currentTarget;
                      const container = img.closest('.carousel-container') as HTMLElement;
                      if (container) {
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        const containerWidth = container.offsetWidth;
                        const calculatedHeight = containerWidth / aspectRatio;
                        const maxHeight = typeof height === 'number' ? height : parseInt(height.toString().replace('px', ''));
                        
                        // 如果計算出的高度小於最大高度，使用計算出的高度；否則使用最大高度
                        if (calculatedHeight > 0 && calculatedHeight < maxHeight) {
                          container.style.height = `${calculatedHeight}px`;
                        } else {
                          container.style.height = `${maxHeight}px`;
                        }
                      }
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* 指示器 - 顯示點點，移到容器外 */}
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'primary.main' : 'grey.400',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    bgcolor: index === currentIndex ? 'primary.dark' : 'grey.500',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

