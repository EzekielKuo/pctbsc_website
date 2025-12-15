'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import KeyVisual from '../../components/KeyVisual';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

export default function ThemePage() {
  // 主視覺圖片
  const [keyVisualUrl, setKeyVisualUrl] = useState<string | null>(null);

  useEffect(() => {
    // 從 API 獲取主視覺圖片
    const fetchKeyVisual = async () => {
      try {
        const response = await fetch('/api/keyvisual');
        const result = await response.json();
        if (result.success && result.data) {
          setKeyVisualUrl(result.data.url);
        }
      } catch (err) {
        console.error('獲取主視覺圖片錯誤:', err);
      }
    };
    fetchKeyVisual();
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
        {/* 主視覺圖片 */}
        <KeyVisual imageUrl={keyVisualUrl} />

        {/* 主題內容 */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h4" component="h1" align="center" sx={{ mb: 6, fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            第 63 屆大專聖經神學研究班《羅馬書》
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              mb: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
              主題介紹：赦免誰的罪過
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                mb: 3,
                color: 'text.primary',
              }}
            >
              被改革宗神學家加爾文譽為「聖經隱藏寶藏入口」的《羅馬書》，奠定了系統的神學框架，是一本艱深卻關鍵的書卷。保羅在其中書寫著罪、赦免與救恩；一知半解的我們，讀了一遍又一遍，卻仍在心底發出叩問：
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                我們，有罪嗎？罪跟我，又有什麼關係呢？
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                罪、赦免與救恩作為基督信仰的核心，與我何干？又是如何發生的？
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                誰赦免、赦免誰、為何而赦？罪、律法、基督、恩典在其中扮演了什麼角色？
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                當我們藉著救恩與上帝和好，我們如何藉著上帝與他人和好？
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: 'text.primary',
                  fontWeight: 600,
                }}
              >
                是誰赦免了誰的罪過？我們又信仰著什麼呢？
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.primary',
                fontStyle: 'italic',
              }}
            >
              六三神研，邀請你一同進入《羅馬書》，直面靈魂的提問，在叩問與回應中尋找信仰的真實。
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
              活動資訊
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1 }}>
                <strong>時間：</strong>2026 年 1 月 26 日（一）～ 1 月 31 日（六）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1 }}>
                <strong>地點：</strong>新竹聖經學院（新竹市東區高峰路 56 號）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1 }}>
                <strong>研讀經卷：</strong>羅馬書（請預備心參與並閱讀新約《羅馬書》一次以上）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                <strong>網路報名連結：</strong>
                <a
                  href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL0"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'none', marginLeft: '8px' }}
                >
                  https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL0
                </a>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

