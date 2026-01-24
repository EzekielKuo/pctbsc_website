'use client';

import { Box } from '@mui/material';

interface KeyVisualProps {
  imageUrl?: string | null;
}

export default function KeyVisual({ imageUrl }: KeyVisualProps) {
  return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
        backgroundColor: 'black',
        minHeight: imageUrl ? 'auto' : '200px',
        }}
      >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt="主視覺"
          sx={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            minHeight: '200px',
            backgroundColor: 'black',
          }}
        />
      )}
      </Box>
  );
}
