'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';

export default function HuangHsuHuiPage() {
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
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
          第50屆後｜黃敍慧姊妹
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            完整影片與逐字稿
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            影片與逐字稿內容即將推出，敬請期待
          </Typography>
        </Paper>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            黃敍慧姊妹的神研文章
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary">
            文章內容即將推出，敬請期待
          </Typography>
        </Paper>
      </Container>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

