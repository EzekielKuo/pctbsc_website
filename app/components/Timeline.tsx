'use client';

import { Container, Typography, Box, Card, CardContent, Button, Chip, Stack } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Link from 'next/link';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  action?: string;
  actionLink?: string;
  isPast?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function TimelineComponent({ events }: TimelineProps) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, fontWeight: 700 }}>
        重要時程
      </Typography>
      <Timeline position="right" sx={{ display: { xs: 'none', md: 'block' } }}>
        {events.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card sx={{ opacity: event.isPast ? 0.6 : 1, mb: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="body2" color="primary" fontWeight={600}>
                      {event.date}
                    </Typography>
                    {event.isPast && (
                      <Chip label="已過期" size="small" color="default" />
                    )}
                  </Stack>
                  <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 700 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description}
                  </Typography>
                  {event.action && event.actionLink && !event.isPast && (
                    <Link href={event.actionLink} style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        {event.action}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Mobile view */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {events.map((event, index) => (
          <Card key={index} sx={{ mb: 3, opacity: event.isPast ? 0.6 : 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body2" color="primary" fontWeight={600}>
                  {event.date}
                </Typography>
                {event.isPast && <Chip label="已過期" size="small" color="default" />}
              </Stack>
              <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 700 }}>
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {event.description}
              </Typography>
              {event.action && event.actionLink && !event.isPast && (
                <Link href={event.actionLink} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    {event.action}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
