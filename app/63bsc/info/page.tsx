'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import KeyVisual from '../../components/KeyVisual';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import { useState, useEffect } from 'react';

export default function InfoPage() {
  const [keyVisualUrl, setKeyVisualUrl] = useState<string | null>(null);

  useEffect(() => {
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
        <KeyVisual imageUrl={keyVisualUrl} />

        <Container maxWidth="lg" sx={{ py: 6, mt: 4, color: 'white' }}>
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 6, fontWeight: 700, color: 'white' }}>
            活動資訊
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              mb: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              活動資訊
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white' }}>
                <strong>時間：</strong>2026 年 1 月 26 日（一）～ 1 月 31 日（六）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white' }}>
                <strong>地點：</strong>新竹聖經學院（新竹市東區高峰路 56 號）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white' }}>
                <strong>研讀經卷：</strong>羅馬書（請預備心參與並閱讀新約《羅馬書》一次以上）
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'white' }}>
                <strong>網路報名連結：</strong>
                <a
                  href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ff6b35', textDecoration: 'none', marginLeft: '8px' }}
                >
                  https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T
                </a>
              </Typography>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 700, color: 'white' }}>
              報名資訊
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                對象
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3, color: 'white' }}>
                大專生及研究生（就讀中），共 120 名。
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                報名時間
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white', fontWeight: 600 }}>
                  第一階段：10/13（一）中午 12:00 ～ 11/7（五）晚上 23:59
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 2, color: 'rgba(255, 255, 255, 0.8)', pl: 2 }}>
                  報名完成後一週內須完成繳費，額滿 120 名即關閉系統
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white', fontWeight: 600 }}>
                  第二階段：11/21（五）中午 12:00 ～ 12/5（五）中午 12:00
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)', pl: 2 }}>
                  釋出剩餘名額，報名完成後一週內須完成繳費，額滿即止
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                報名費用
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 2, color: 'white' }}>
                每人新台幣 3,500 元
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)', pl: 2 }}>
                （總會已有補助，含食宿、場地、講師、保險）
              </Typography>
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                  • 已繳費恕不退費；若因私人因素無法參加，請自行找同性別學員替補
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                  • 線上繳費憑證將於 2025 年開立；若需 2026 年度收據，請於報名時備註
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)' }}>
                  • 郵政劃撥憑證將於 2026 年開立；若需 2025 年度收據，請於報名時備註
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />

            <Box>
              <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
                繳費方式
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white', fontWeight: 600 }}>
                  【線上繳費】
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 2, color: 'rgba(255, 255, 255, 0.8)', pl: 2 }}>
                  活動報名系統內直接付款（ATM）
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 1, color: 'white', fontWeight: 600 }}>
                  【郵政劃撥】
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                    帳號：19566285
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                    戶名：財團法人台灣基督長老教會宣教基金會
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                    通訊欄請註記：大專 63 神研班、錄取學員姓名、繳費憑單抬頭全銜
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)' }}>
                    繳費後請回傳至活動報名系統
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

