'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SchedulePage() {
  const [scheduleUrl, setScheduleUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 API 獲取活動日程表
    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/schedule');
        const result = await response.json();
        if (result.success && result.data) {
          setScheduleUrl(result.data.url);
        }
      } catch (err) {
        console.error('獲取活動日程表錯誤:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
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
      <Navigation currentPage="about" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 6, fontWeight: 700 }}>
            活動日程表
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : scheduleUrl ? (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={scheduleUrl}
                  alt="活動日程表"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: 1,
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                尚未上傳活動日程表
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

