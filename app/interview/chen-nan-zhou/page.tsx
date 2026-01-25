'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Paper, Divider, Link } from '@mui/material';
import { ExternalLink } from 'lucide-react';

export default function ChenNanZhouPage() {
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
          第1-7屆｜陳南州牧師
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            完整影片與逐字稿
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Link
            href="https://sites.google.com/view/pctbsc62interview/%E7%AC%AC1-7%E5%B1%86%E9%99%B3%E5%8D%97%E5%B7%9E%E7%89%A7%E5%B8%AB?authuser=0"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <ExternalLink size={18} aria-hidden />
            <Typography component="span" variant="body1">(連結)</Typography>
          </Link>
        </Paper>
      </Container>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

