'use client';

import Link from 'next/link';
import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material';
import packageJson from '@/package.json';
import { event } from '@/lib/gtag';

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
              相關連結
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {links.map((link, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <MuiLink
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => event({
                      action: 'click',
                      category: 'external_link',
                      label: link.name,
                    })}
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
                  onClick={() => event({
                    action: 'click',
                    category: 'contact',
                    label: 'Email',
                  })}
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
            <MuiLink
              component={Link}
              href="/login"
              onClick={() => event({
                action: 'click',
                category: 'navigation',
                label: 'Login',
              })}
              sx={{
                textDecoration: 'none',
                color: '#1976d2',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-block',
                '&:hover': { color: '#1565c0' },
              }}
            >
              Login
            </MuiLink>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'grey.700', mb: 4 }} />
        <Typography variant="body2" align="center" color="grey.400">
          2025 by Ezekiel · v{packageJson.version}
        </Typography>
      </Container>
    </Box>
  );
}
