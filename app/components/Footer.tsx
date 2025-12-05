'use client';

import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material';
import Link from 'next/link';

interface FooterProps {
  contactInfo: {
    phone: string;
    email: string;
  };
  links: Array<{
    name: string;
    url: string;
  }>;
}

export default function Footer({ contactInfo, links }: FooterProps) {
  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              推薦連結
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {links.map((link, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <MuiLink
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="grey.300"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { color: 'white' },
                    }}
                  >
                    {link.name}
                  </MuiLink>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              聯絡我們
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, color: 'grey.300' }}>
              <Box component="li" sx={{ mb: 1 }}>
                電話：{contactInfo.phone}
              </Box>
              <Box component="li">
                E-mail：{' '}
                <MuiLink
                  href={`mailto:${contactInfo.email}`}
                  color="grey.300"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {contactInfo.email}
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              關於我們
            </Typography>
            <Typography variant="body2" color="grey.300">
              大專聖經神學研究班致力於大專學生的福音工作，透過營會、查經、團契等方式，幫助大學生認識信仰、建立生命。
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'grey.700', mb: 4 }} />
        <Typography variant="body2" align="center" color="grey.400">
          Copyright ©2018 Campus Evangelical Fellowship All Rights Reserved. ．校園福音團契 版權所有．
        </Typography>
      </Container>
    </Box>
  );
}
