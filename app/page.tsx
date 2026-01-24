'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ImageCarousel from './components/ImageCarousel';
import Promotion from './components/Promotion';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';
import { Box, Container, Typography, Paper } from '@mui/material';

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
  const [aboutBSCContent, setAboutBSCContent] = useState<string>('');

  useEffect(() => {
    // 從 API 獲取輪播圖片
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch('/api/carousel');
        const result = await response.json();
        if (result.success && result.data) {
          setCarouselImages(result.data.map((img: { url: string }) => img.url));
        }
      } catch (err) {
        console.error('獲取輪播圖片錯誤:', err);
      }
    };

    // 從 API 獲取「什麼是神研班？」內容
    const fetchAboutBSC = async () => {
      try {
        const response = await fetch('/api/about-bsc');
        const result = await response.json();
        if (result.success && result.data) {
          setAboutBSCContent(result.data.content || '');
        }
      } catch (err) {
        console.error('獲取「什麼是神研班？」內容錯誤:', err);
      }
    };

    fetchCarouselImages();
    fetchAboutBSC();
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

        {/* 什麼是神研班？Section */}
        <Container 
          maxWidth={false} 
          sx={{ 
            py: 4, 
            mt: -4, 
            bgcolor: '#E6E6FA',
            px: { xs: 2, md: 4 }
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              sx={{ mt: 2, mb: 4, fontWeight: 700, color: '#333' }}
            >
              什麼是神研班？
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 2,
                bgcolor: '#E6E6FA',
                color: '#333',
              }}
            >
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.8, 
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
              }}
            >
              {aboutBSCContent}
            </Typography>
            </Paper>
          </Container>
        </Container>

        {/* 宣傳組資訊 Section */}
        <Promotion title="宣傳組資訊" />

        {/* Message Board Section */}
        <MessageBoard />
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
