'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Image from 'next/image';

interface AboutSection {
  title: string;
  description: string;
  imageUrl?: string;
  imageOnLeft: boolean;
}

export default function AboutPage() {
  const sections: AboutSection[] = [
    {
      title: '小組查經',
      description: '在群體中查經，彼此聆聽對聖經的觀察與理解，拓展對信仰的廣度與深度。',
      imageOnLeft: true,
    },
    {
      title: '大堂專講',
      description: '透過文本中的閱讀，用上下文推敲經文脈絡，一窺聖經作者的信息奧秘。',
      imageOnLeft: false,
    },
    {
      title: '工作坊',
      description: '多元的選課式專題，開啟對聖經與宣道的瞭解，連結生活與信仰的實踐。',
      imageOnLeft: true,
    },
  ];

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
            關於神研班
          </Typography>

          {sections.map((section, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                mb: 6,
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Grid container spacing={0} sx={{ minHeight: 400 }}>
                {/* 圖片和文字交替顯示 */}
                {section.imageOnLeft ? (
                  <>
                    {/* 圖片在左側 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: 300, md: 400 },
                          backgroundColor: 'grey.200',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {section.imageUrl ? (
                          <Image
                            src={section.imageUrl}
                            alt={section.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            圖片待上傳
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    {/* 文字在右側 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: 300, md: 400 },
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          p: { xs: 4, md: 6 },
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: 'primary.main',
                          }}
                        >
                          {section.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            color: 'text.primary',
                          }}
                        >
                          {section.description}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <>
                    {/* 文字在左側 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: 300, md: 400 },
                          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          p: { xs: 4, md: 6 },
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: 'primary.main',
                          }}
                        >
                          {section.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            color: 'text.primary',
                          }}
                        >
                          {section.description}
                        </Typography>
                      </Box>
                    </Grid>
                    {/* 圖片在右側 */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          minHeight: { xs: 300, md: 400 },
                          backgroundColor: 'grey.200',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {section.imageUrl ? (
                          <Image
                            src={section.imageUrl}
                            alt={section.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            圖片待上傳
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          ))}
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
