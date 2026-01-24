'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ImageCarousel from './components/ImageCarousel';
import Promotion from './components/Promotion';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';
import { Box } from '@mui/material';

export default function Home() {


  // 宣傳組資訊（暫時為空，待後續補充內容）
  type Feature = {
    title: string;
    description: string;
    icon: string;
  };
  const promotionInfo: Feature[] = [];

  // 輪播圖片
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    // 從 API 獲取輪播圖片
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('/api/carousel');
        const result = await response.json();
        if (result.success && result.data) {
          setCarouselImages(result.data.map((img: any) => img.url));
        }
      } catch (err) {
        console.error('獲取輪播圖片錯誤:', err);
      }
    };
    fetchCarouselImages();
  }, []);

  // 聯絡資訊
  const contactInfo = {
    phone: '(02)2362-5282',
    email: 'highedu@mail.pct.org.tw',
  };

  // 推薦連結
  const links = [
    {
      name: '台灣基督長老教會-大專事工委員會',
      url: 'https://highedu.pct.org.tw/',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation currentPage="home" />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#000000' }}>
        {/* 圖片輪播 */}
        <ImageCarousel images={carouselImages} height={400} interval={10000} />

        {/* 宣傳組資訊 Section */}
        <Promotion title="宣傳組資訊" />

        {/* Message Board Section */}
        <MessageBoard />
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
