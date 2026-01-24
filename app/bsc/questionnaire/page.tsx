'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Box, Container, Typography, Paper } from '@mui/material';
import { DoorOpen, DoorClosed } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuestionnaireLink {
  id?: string;
  doorIndex: number;
  url: string;
}

export default function QuestionnairePage() {
  const [doorStates, setDoorStates] = useState<boolean[]>([false, false, false, false, false, false]);
  const [questionnaireLinks, setQuestionnaireLinks] = useState<QuestionnaireLink[]>([]);

  // 獲取問卷連結
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/questionnaire');
        const result = await response.json();
        if (result.success) {
          setQuestionnaireLinks(result.data);
        }
      } catch (err) {
        console.error('獲取問卷連結錯誤:', err);
      }
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    const checkDoorStates = () => {
      const now = new Date();
      
      // 定義時間區間（使用 2026 年）
      const door1Start = new Date(2026, 0, 26, 17, 0, 0); // 1/26 17:00
      const door1End = new Date(2026, 0, 27, 17, 0, 0);   // 1/27 17:00
      
      const door2Start = new Date(2026, 0, 27, 17, 0, 0); // 1/27 17:00
      const door2End = new Date(2026, 0, 28, 17, 0, 0);   // 1/28 17:00
      
      const door3Start = new Date(2026, 0, 28, 17, 0, 0); // 1/28 17:00
      const door3End = new Date(2026, 0, 29, 17, 0, 0);   // 1/29 17:00
      
      const door4Start = new Date(2026, 0, 29, 17, 0, 0); // 1/29 17:00
      const door4End = new Date(2026, 0, 30, 17, 0, 0);   // 1/30 17:00
      
      const door5Start = new Date(2026, 0, 30, 17, 0, 0); // 1/30 17:00
      const door5End = new Date(2026, 0, 31, 11, 0, 0);   // 1/31 11:00
      
      const door6Start = new Date(2026, 0, 31, 11, 0, 0); // 1/31 11:00
      const door6End = new Date(2026, 0, 31, 23, 59, 59); // 1/31 23:59

      const newDoorStates = [false, false, false, false, false, false];

      // 1/26 17:00 到 1/27 17:00：左上開門 (索引 0)
      if (now >= door1Start && now < door1End) {
        newDoorStates[0] = true;
      }
      // 1/27 17:00 到 1/28 17:00：中上開門 (索引 1)
      else if (now >= door2Start && now < door2End) {
        newDoorStates[1] = true;
      }
      // 1/28 17:00 到 1/29 17:00：右上開門 (索引 2)
      else if (now >= door3Start && now < door3End) {
        newDoorStates[2] = true;
      }
      // 1/29 17:00 到 1/30 17:00：左下開門 (索引 3)
      else if (now >= door4Start && now < door4End) {
        newDoorStates[3] = true;
      }
      // 1/30 17:00 到 1/31 11:00：中下開門 (索引 4)
      else if (now >= door5Start && now < door5End) {
        newDoorStates[4] = true;
      }
      // 1/31 11:00~23:59：右下開門 (索引 5)
      else if (now >= door6Start && now <= door6End) {
        newDoorStates[5] = true;
      }

      setDoorStates(newDoorStates);
    };

    // 初始檢查
    checkDoorStates();

    // 每秒檢查一次
    const interval = setInterval(checkDoorStates, 1000);

    return () => clearInterval(interval);
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

  // 渲染單個門
  const renderDoor = (doorIndex: number) => {
    const isOpen = doorStates[doorIndex];
    const link = questionnaireLinks.find((l) => l.doorIndex === doorIndex);
    const hasLink = link && link.url;

    const doorIcon = isOpen ? (
      <DoorOpen size={120} strokeWidth={1.5} color="white" />
    ) : (
      <DoorClosed size={120} strokeWidth={1.5} color="white" />
    );

    // 如果門是開的且有連結，就可以點擊
    if (isOpen && hasLink) {
      return (
        <Box
          component="a"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, opacity 0.2s',
            display: 'inline-block',
            '&:hover': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
          }}
        >
          {doorIcon}
        </Box>
      );
    }

    // 否則只是顯示門的圖示
    return (
      <Box sx={{ textAlign: 'center', opacity: isOpen ? 1 : 0.5 }}>
        {doorIcon}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000' }}>
      <Navigation currentPage="about" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ py: 6, mt: 4, color: 'white' }}>
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 6, fontWeight: 700, color: 'white' }}>
            每日問卷
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
            {/* 上排三個門 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 2, md: 4 }, 
              mb: 6,
              flexWrap: 'wrap'
            }}>
              {/* 左上 */}
              {renderDoor(0)}
              {/* 中上 */}
              {renderDoor(1)}
              {/* 右上 */}
              {renderDoor(2)}
            </Box>

            {/* 下排三個門 */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: { xs: 2, md: 4 },
              flexWrap: 'wrap'
            }}>
              {/* 左下 */}
              {renderDoor(3)}
              {/* 中下 */}
              {renderDoor(4)}
              {/* 右下 */}
              {renderDoor(5)}
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}
