'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

interface CountdownProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, mounted]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 3 },
        minWidth: { xs: 70, md: 100 },
        minHeight: { xs: 90, md: 120 },
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          lineHeight: 1.2,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          fontSize: { xs: '0.875rem', md: '1rem' },
          fontWeight: 500,
          letterSpacing: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        color: 'white',
        py: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{
            mt: { xs: 2, md: 3 },
            mb: { xs: 3, md: 5 },
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            letterSpacing: 2,
          }}
        >
          營會倒數
        </Typography>
        {mounted ? (
          <Grid container spacing={{ xs: 1.5, md: 2 }} justifyContent="center" alignItems="center">
            <Grid item>
              <TimeUnit value={timeLeft.days} label="天" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={timeLeft.hours} label="時" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={timeLeft.minutes} label="分" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={timeLeft.seconds} label="秒" />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={{ xs: 1.5, md: 2 }} justifyContent="center" alignItems="center">
            <Grid item>
              <TimeUnit value={0} label="天" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={0} label="時" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={0} label="分" />
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mx: { xs: 0.5, md: 1 },
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                :
              </Typography>
            </Grid>
            <Grid item>
              <TimeUnit value={0} label="秒" />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
