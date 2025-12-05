'use client';

import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesProps {
  features: Feature[];
}

export default function Features({ features }: FeaturesProps) {
  return (
    <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 6, fontWeight: 700 }}>
          營會特色
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
