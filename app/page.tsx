'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ImageCarousel from './components/ImageCarousel';
import Promotion from './components/Promotion';
import MessageBoard from './components/MessageBoard';
import Footer from './components/Footer';
import { Box, Container, Typography } from '@mui/material';

type IntroSection = {
  title: string;
  body: string;
};

const INTRO_SECTIONS: IntroSection[] = [
  {
    title: '專講',
    body: '邀請專業的神學學者與牧者，針對當屆研讀經卷進行深度的經文解構。內容涵蓋當代的歷史背景、文學結構分析以及神學核心議題，旨在提供扎實的知識基礎，引導學員建立嚴謹的讀經視角與思考框架。',
  },
  {
    title: '工作坊',
    body: '延續聖經研究的核心精神，透過多元的主題講座（如社會參與、性別議題、心理健康、藝術實踐等），探討基督信仰在不同領域的應用。藉由實務經驗分享與交流，協助學員將信仰反思轉化為生活中的實踐行動。',
  },
  {
    title: '小組討論',
    body: '此乃為營會的核心環節。學員將以小組為單位，在輔導的陪伴下共同研讀經卷。透過提問、辯論與彼此傾聽，在多元的觀點中激盪思考，嘗試在群體中尋找經文對當代生活的啟發與意義。',
  },
  {
    title: '小書房',
    body: '營會現場設有精選書區，提供神學、人文、社會科學、靈修類型等相關書籍。此空間鼓勵學員在密集的行程之餘，透過閱讀與作者對話，深化個人對特定議題的理解與研究。',
  },
  {
    title: '獻心會',
    body: '營會末尾的禮拜環節。引導學員整理數日來的學習領受與生命掙扎，在安靜與敬拜中回應上帝的呼召。這不僅是信仰的交託，更是帶著在營隊中的體會回到日常生活，持續回應信仰。',
  },
];

type IntroSectionImageMap = Record<string, string>;

export default function Home() {
  // 輪播圖片
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  // 神研班介紹區塊圖片（專講、工作坊、小組討論、小書房、獻心會）
  const [introSectionImages, setIntroSectionImages] = useState<IntroSectionImageMap>({});

  useEffect(() => {
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
    fetchCarouselImages();
  }, []);

  useEffect(() => {
    const fetchIntroSectionImages = async () => {
      try {
        const response = await fetch('/api/intro-section-images');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const map: IntroSectionImageMap = {};
          for (const row of result.data as { sectionKey: string; url: string }[]) {
            map[row.sectionKey] = row.url;
          }
          setIntroSectionImages(map);
        }
      } catch (err) {
        console.error('獲取神研班介紹區塊圖片錯誤:', err);
      }
    };
    fetchIntroSectionImages();
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

        {/* 神研班介紹 Section */}
        <Box sx={{ mt: -4, bgcolor: '#3d3733' }}>
          <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.95)', mb: 6 }}
            >
              神研班介紹
            </Typography>

            {INTRO_SECTIONS.map((section, index) => (
              <Box
                key={section.title}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'stretch',
                  mb: 6,
                  gap: 0,
                }}
              >
                <Box
                  sx={{
                    flex: { md: '0 0 50%' },
                    maxWidth: { md: '50%' },
                    position: 'relative',
                  }}
                >
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1,
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.25)',
                      lineHeight: 1,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      aspectRatio: '4/3',
                      bgcolor: 'rgba(0,0,0,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                    }}
                  >
                    {introSectionImages[section.title] ? (
                      <Box
                        component="img"
                        src={introSectionImages[section.title]}
                        alt={section.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      '照片待放置'
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: { md: '1 1 50%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: { xs: 3, md: 4 },
                    px: { xs: 0, md: 5 },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.95)',
                      mb: 2,
                      fontSize: '1.5rem',
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: 1.9,
                      color: 'rgba(255,255,255,0.88)',
                      fontSize: '1rem',
                    }}
                  >
                    {section.body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Container>
        </Box>

        {/* 宣傳組資訊 Section */}
        <Promotion title="宣傳組資訊" />

        {/* Message Board Section */}
        <MessageBoard />
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
