'use client';

import { Container, Typography, Box, IconButton } from '@mui/material';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { event } from '@/lib/gtag';

interface InstagramPost {
  id: string;
  url: string;
  name?: string | null;
  description?: string | null;
  order: number;
}

interface PromotionProps {
  title?: string;
}

// 將 Instagram URL 轉換為嵌入 URL
function getInstagramEmbedUrl(url: string): string {
  // 從 Instagram URL 中提取貼文 ID
  // 格式: https://www.instagram.com/p/ABC123/ 或 https://www.instagram.com/reel/ABC123/
  const match = url.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/p/${match[1]}/embed/`;
  }
  return url;
}

// 解碼 HTML 實體
function decodeHTMLEntities(text: string): string {
  if (typeof window === 'undefined') return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export default function Promotion({ title = '宣傳組資訊' }: PromotionProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollbarReady, setScrollbarReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0); // 滑鼠在 thumb 上的相對位置
  const scrollbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        const result = await response.json();
        if (result.success && result.data) {
          setPosts(result.data);
        }
      } catch (err) {
        console.error('獲取 Instagram 貼文錯誤:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 計算一個貼文的寬度（包括間距）
  const getPostWidth = () => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    const firstPost = container.querySelector('[data-post]') as HTMLElement;
    if (!firstPost) return 0;
    const postWidth = firstPost.offsetWidth;
    const gap = 24; // gap: 3 = 24px
    return postWidth + gap;
  };

  const handlePrevious = () => {
    if (!scrollContainerRef.current) return;
    const postWidth = getPostWidth();
    const newPosition = Math.max(0, scrollPosition - postWidth);
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
    event({
      action: 'click',
      category: 'carousel',
      label: 'Instagram 左箭頭',
    });
  };

  const handleNext = () => {
    if (!scrollContainerRef.current) return;
    const postWidth = getPostWidth();
    const maxScroll = getMaxScrollPosition();
    const newPosition = Math.min(maxScroll, scrollPosition + postWidth);
    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
    event({
      action: 'click',
      category: 'carousel',
      label: 'Instagram 右箭頭',
    });
  };

  // 監聽滾動事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (!scrollContainerRef.current) return;
    setScrollbarReady(true);
  }, [posts]);

  // 計算滾動條的最大可滾動距離
  const getMaxScrollPosition = () => {
    if (!scrollContainerRef.current) return 0;
    const container = scrollContainerRef.current;
    return container.scrollWidth - container.clientWidth;
  };

  // 計算滾動條位置
  const getScrollbarPosition = () => {
    if (!scrollContainerRef.current) return 0;
    const maxScroll = getMaxScrollPosition();
    if (maxScroll === 0) return 0;
    const widthPercent = getScrollbarWidth();
    const ratio = Math.min(Math.max(scrollPosition / maxScroll, 0), 1);
    return ratio * (100 - widthPercent);
  };

  // 計算滾動條寬度（顯示2.5個貼文的比例）
  const getScrollbarWidth = () => {
    if (!scrollContainerRef.current || posts.length === 0) return 0;
    const container = scrollContainerRef.current;
    const visibleWidth = container.clientWidth;
    const totalWidth = container.scrollWidth;
    return (visibleWidth / totalWidth) * 100;
  };

  // 計算滾動條的最大位置百分比（不能到100%）
  const getMaxScrollbarPosition = () => {
    const scrollbarWidth = getScrollbarWidth();
    return Math.max(0, 100 - scrollbarWidth);
  };

  // 處理滾動條拖動
  const handleScrollbarMouseDown = (e: React.MouseEvent) => {
    if (!scrollbarRef.current || !scrollContainerRef.current) return;
    
    const scrollbar = scrollbarRef.current;
    const rect = scrollbar.getBoundingClientRect();
    const scrollbarWidth = getScrollbarWidth();
    const thumbPosition = getScrollbarPosition();
    const thumbLeftPx = (thumbPosition / 100) * rect.width;
    
    // 記錄滑鼠相對於 thumb 左邊緣的偏移量
    const offsetInThumb = e.clientX - rect.left - thumbLeftPx;
    setThumbOffset(offsetInThumb);
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScroll(scrollPosition);
    e.preventDefault();
  };

  const handleScrollbarMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollbarRef.current || !scrollContainerRef.current) return;

    const scrollbar = scrollbarRef.current;
    const container = scrollContainerRef.current;
    const rect = scrollbar.getBoundingClientRect();
    
    // 計算滑鼠在 scrollbar 上的位置，減去 thumb 內的偏移量
    const mouseXInScrollbar = e.clientX - rect.left - thumbOffset;
    
    // 計算 thumb 左邊緣應該在的位置（百分比）
    const maxPosition = getMaxScrollbarPosition();
    const thumbPositionPercent = Math.max(0, Math.min(maxPosition, (mouseXInScrollbar / rect.width) * 100));
    
    // 將百分比轉換為實際滾動位置
    const maxScroll = getMaxScrollPosition();
    const newScrollPosition = (thumbPositionPercent / maxPosition) * maxScroll;
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'auto',
    });
    setScrollPosition(newScrollPosition);
  };

  const handleScrollbarMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleScrollbarMouseMove);
      document.addEventListener('mouseup', handleScrollbarMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleScrollbarMouseMove);
        document.removeEventListener('mouseup', handleScrollbarMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, fontWeight: 700, color: 'primary.main' }}>
          {title}
        </Typography>
        {loading ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            載入中...
          </Typography>
        ) : posts.length === 0 ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            內容即將推出，敬請期待
          </Typography>
        ) : (
          <Box sx={{ position: 'relative' }}>
            {/* 左箭頭 */}
            <IconButton
              onClick={handlePrevious}
              disabled={scrollPosition === 0}
              sx={{
                position: 'absolute',
                left: -60,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
                '@media (max-width: 1200px)': {
                  left: -40,
                },
                '@media (max-width: 960px)': {
                  left: 10,
                },
              }}
            >
              <ArrowLeft />
            </IconButton>

            {/* 貼文容器 - 可滾動，顯示2.5個貼文 */}
            <Box
              ref={scrollContainerRef}
              sx={{
                position: 'relative',
                overflowX: 'auto',
                overflowY: 'hidden',
                width: '100%',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
                '&::-webkit-scrollbar': {
                  display: 'none', // Chrome/Safari
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  width: 'max-content',
                }}
              >
                {posts.map((post) => (
                  <Box
                    key={post.id}
                    data-post
                    sx={{
                      flex: '0 0 auto',
                      width: 320,
                      minWidth: 320,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        bgcolor: 'white',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        '& iframe': {
                          width: '100%',
                          border: 'none',
                        },
                      }}
                    >
                      <iframe
                        src={getInstagramEmbedUrl(post.url)}
                        title={`Instagram 貼文 ${post.id}`}
                        width="100%"
                        height="440"
                        frameBorder="0"
                        scrolling="no"
                        {...{
                          allowtransparency: 'true',
                        } as React.IframeHTMLAttributes<HTMLIFrameElement>}
                        style={{
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* 右箭頭 */}
            <IconButton
              onClick={handleNext}
              disabled={
                scrollContainerRef.current
                  ? scrollPosition >= getMaxScrollPosition()
                  : false
              }
              sx={{
                position: 'absolute',
                right: -60,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
                '@media (max-width: 1200px)': {
                  right: -40,
                },
                '@media (max-width: 960px)': {
                  right: 10,
                },
              }}
            >
              <ArrowRight />
            </IconButton>

            {/* 可拖動的滾動條 */}
            <Box sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
              <Box
                ref={scrollbarRef}
                onMouseDown={handleScrollbarMouseDown}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '12px',
                  bgcolor: 'grey.300',
                  borderRadius: '6px',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  '&:hover': {
                    bgcolor: 'grey.400',
                  },
                }}
              >
                {(() => {
                  const scrollbarWidth = getScrollbarWidth();
                  const thumbWidth = Math.max(scrollbarWidth, 5);
                  const thumbLeft = Math.min(getScrollbarPosition(), 100 - thumbWidth);
                  return (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${thumbLeft}%`,
                        width: `${thumbWidth}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: '6px',
                        transition: isDragging ? 'none' : 'left 0.2s ease',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    />
                  );
                })()}
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
