'use client';

import Navigation from './components/Navigation';
import Countdown from './components/Countdown';
import TimelineComponent from './components/Timeline';
import Features from './components/Features';
import Footer from './components/Footer';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  // 營會開始日期：2026.01.20
  const campStartDate = new Date('2026-01-20T00:00:00');

  // 時間線事件
  const timelineEvents = [
    {
      date: '2025.12.08（一）',
      title: '報名截止',
      description: '恕不接受逾期報名',
      action: '報名',
      actionLink: '/registration',
      isPast: false,
    },
    {
      date: '2025.11.11（二）',
      title: '開始選課',
      description: '選課',
      action: '選課',
      actionLink: '/course-selection',
      isPast: false,
    },
    {
      date: '2025.12.22（一）',
      title: '選課截止',
      description: '恕不接受逾期選課',
      isPast: false,
    },
    {
      date: '2026.01.20（二）',
      title: '營會開始',
      description: '報名 詳細資訊',
      action: '詳細資訊',
      actionLink: '/about',
      isPast: false,
    },
  ];

  // 營會特色
  const features = [
    {
      title: '群體查經',
      description: '在群體中查經，彼此聆聽對聖經的觀察與理解，拓展對信仰的廣度與深度。',
      icon: '📖',
    },
    {
      title: '信仰伙伴',
      description: '認識來自台灣各地的基督徒大學生，一起探討信仰議題、一起唱詩查經、一起同奔天路。',
      icon: '👥',
    },
    {
      title: '讀經方法',
      description: '透過文本中的閱讀，用上下文推敲經文脈絡，一窺聖經作者的信息奧秘。',
      icon: '🔍',
    },
    {
      title: '多元課程',
      description: '多元的選課式專題，開啟對聖經與宣道的瞭解，連結生活與信仰的實踐。',
      icon: '📚',
    },
  ];

  // 聯絡資訊
  const contactInfo = {
    phone: '(02)6604-2232',
    email: 'uc@cef.tw',
  };

  // 推薦連結
  const links = [
    {
      name: '台灣基督長老教會',
      url: 'https://www.pct.org.tw/',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation currentPage="home" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section with Countdown */}
        <Countdown targetDate={campStartDate} />

        {/* Timeline Section */}
        <TimelineComponent events={timelineEvents} />

        {/* Features Section */}
        <Features features={features} />

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 8,
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h4" component="h2" align="center" sx={{ mb: 2, fontWeight: 700 }}>
              準備好加入我們了嗎？
            </Typography>
            <Typography variant="h6" align="center" sx={{ mb: 4, color: 'primary.light' }}>
              立即報名參加大專聖經神學研究班，與我們一起探索信仰、建立生命
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Link href="/registration" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  size="large"
                >
                  立即報名
                </Button>
              </Link>
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'white',
                      color: 'primary.main',
                    },
                  }}
                  size="large"
                >
                  了解更多
                </Button>
              </Link>
            </Stack>
          </Container>
        </Box>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
