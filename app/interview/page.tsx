'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Box, Container, Typography, Paper, Divider, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export default function InterviewPage() {
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
          神研前輩訪談
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            緣起
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            製作團隊｜62th宣傳組籌委--旭鈞、妍安、語涵
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            你知道嗎？神研班曾是個報名秒殺，還要開一梯二梯的300人大營隊。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            你知道嗎？參加神研班曾經要自己扛棉被上山，還曾遇到霸王級寒流，全營一起大感冒。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            你知道嗎？神研班最初的主辦人，不是總會，不是牧師，而是一群年輕的神學生。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            神研班自1971年6月30日創立，如今已經來到了第62屆。我們享受在此時此刻的碰撞，同時也在承先啟後，續寫歷史。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            與團契輔導談起神研班時，總感覺他們眼裡閃閃發光。學生力量燃起的熱情、鏗鏘有力的經文探討、在神研班遇見知心好友，似乎是他們年輕時，很重要的一段經歷。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            卻也發現，輔導記憶裡的神研班，似乎與我經歷的有些微妙的不同。或許是疫情停辦兩年後，不可免的產生某些斷層；又或許是時代與處境的變遷，使當代學生對神學聖經研究有了不同想像。神研班是如何一步步走到今天的呢？如今的營隊模型，又延續著什麼樣的精神？帶著對神研歷史的好奇，我們決定延續61屆籌委開創的「前輩訪談」項目。在籌備期間特地前往台北及花蓮，訪問了三位來自不同年代的神研前輩，邀請大家一同繼續探尋神研老中青的故事--那些在他們眼裡閃爍的光芒。
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            原本想要剪短片，但因為受訪者的故事都太精彩了，每一段都是精華，就把正整場採訪的影片分享給大家當偽podcast聽了。
          </Typography>
          <Typography variant="body1" paragraph>
            附上華語逐字稿、摘要，歡迎大家來聽故事！
          </Typography>
        </Paper>

      </Container>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

