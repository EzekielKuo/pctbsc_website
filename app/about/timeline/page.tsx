'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import TimelineComponent from '../../components/Timeline';
import { Box, Container } from '@mui/material';

export default function TimelinePage() {
  // 時間線事件
  const timelineEvents = [
    {
      date: '2025.10.13（一）',
      title: '第一階段報名開始',
      description: '2025/10/13(一)中午12:00，開放報名至2025/11/7(五)晚上23:59。需於報名後，一週內完成繳費流程。名額滿120人後，系統即關閉!',
      action: '報名',
      actionLink: '/registration',
      isPast: false,
    },
    {
      date: '2025.11.07（五）',
      title: '第一階段報名截止',
      description: '第一階段報名至晚上23:59截止',
      action: '報名',
      actionLink: '/registration',
      isPast: false,
    },
    {
      date: '2025.11.21（五）',
      title: '第二階段報名開始',
      description: '2025/11/21(五)中午12:00，釋出剩餘名額，開放報名至2025/12/5(五)中午12:00。需於報名後，一週內完成繳費流程。名額滿120人後，系統即關閉!',
      action: '報名',
      actionLink: '/registration',
      isPast: false,
    },
    {
      date: '2025.12.05（五）',
      title: '第二階段報名截止',
      description: '第二階段報名至中午12:00截止，恕不接受逾期報名',
      action: '報名',
      actionLink: '/registration',
      isPast: false,
    },
    {
      date: '2026.01.26（一）',
      title: '營會開始',
      description: '活動時間：2026年01月26日(一)至01月31日(六)',
      action: '詳細資訊',
      actionLink: '/about',
      isPast: false,
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
          <TimelineComponent events={timelineEvents} />
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

