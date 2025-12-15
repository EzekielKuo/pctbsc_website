'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

export default function SchedulePage() {
  const [scheduleUrl, setScheduleUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const contactInfo = {
    phone: '(02)2362-5282',
    email: 'highedu@mail.pct.org.tw',
  };

  const links = [
    {
      name: '台灣基督長老教會-大專事工委員會',
      url: 'https://highedu.pct.org.tw/',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000' }}>
      <Navigation currentPage="about" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: 6, mt: 4, color: 'white' }}>
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 6, fontWeight: 700, color: 'white' }}>
            活動日程表
          </Typography>

          <Paper
            elevation={0}
            sx={{
              px: { xs: 2, md: 10 },
              py: 0,
              borderRadius: 2,
              bgcolor: '#000',
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
            ) : (
              <Box sx={{ width: '100%', minHeight: 200 }} />
            )}
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}


