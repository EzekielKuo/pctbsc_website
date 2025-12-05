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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '3rem' } }}>
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, fontSize: { xs: '0.875rem', md: '1rem' } }}>
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 4, fontWeight: 700 }}>
          營會倒數
        </Typography>
        {mounted ? (
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid>
              <TimeUnit value={timeLeft.days} label="天" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={timeLeft.hours} label="時" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={timeLeft.minutes} label="分" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={timeLeft.seconds} label="秒" />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid>
              <TimeUnit value={0} label="天" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={0} label="時" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={0} label="分" />
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: 700, mx: 1 }}>
                :
              </Typography>
            </Grid>
            <Grid>
              <TimeUnit value={0} label="秒" />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
