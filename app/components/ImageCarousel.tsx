'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Container } from '@mui/material';
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
  // 每張圖的寬高比，讓容器隨目前圖片與螢幕寬度貼合上下緣
  const [aspectRatios, setAspectRatios] = useState<Record<number, number>>({});

  // 重置計時器的函數
  const resetTimer = useCallback((isAuto: boolean = true) => {
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
  }, [images.length, interval]);

  useEffect(() => {
    if (images.length === 0) return;

    resetTimer(true); // 初始化時使用自動切換

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images.length, interval, resetTimer]);

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
            bgcolor: '#a7c0d8',
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
            bgcolor: '#a7c0d8',
            boxShadow: 2,
            // 依目前圖片比例隨螢幕寬度改變高度，貼合圖片上下緣
            aspectRatio: aspectRatios[currentIndex] ?? (typeof height === 'number' ? 1600 / height : 4),
            maxHeight: typeof height === 'number' ? `${height}px` : height,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
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
                  alignItems: 'stretch',
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
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    const ratio = img.naturalWidth / img.naturalHeight;
                    setAspectRatios((prev) => ({ ...prev, [index]: ratio }));
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

