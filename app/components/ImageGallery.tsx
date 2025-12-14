'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { GalleryImage } from '@/lib/models';

interface ImageGalleryProps {
  category?: '活動花絮' | '歷史常設展' | '宣傳組資訊' | '其他';
  year?: number;
  limit?: number;
  title?: string;
}

export default function ImageGallery({
  category,
  year,
  limit,
  title,
}: ImageGalleryProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [category, year, limit]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (year) params.append('year', year.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`/api/gallery?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setImages(result.data);
      } else {
        setError(result.error || '載入圖片失敗');
      }
    } catch (err) {
      setError('載入圖片時發生錯誤');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          目前尚無圖片
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {title && (
          <Typography variant="h4" component="h2" align="center" sx={{ mb: 4, fontWeight: 700 }}>
            {title}
          </Typography>
        )}

        <ImageList
          variant="masonry"
          cols={cols}
          gap={16}
        >
          {images.map((image, index) => (
            <ImageListItem key={image._id || index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => handleImageClick(image)}
              >
                <CardMedia
                  component="img"
                  image={image.imageUrl}
                  alt={image.title || '圖片'}
                  sx={{
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                <CardContent>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    {image.title}
                  </Typography>
                  {image.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {image.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip label={image.category} size="small" color="primary" />
                    {image.year && (
                      <Chip label={`${image.year}年`} size="small" variant="outlined" />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </ImageListItem>
          ))}
        </ImageList>
      </Container>

      {/* 圖片詳情對話框 */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  zIndex: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box
                component="img"
                src={selectedImage.imageUrl}
                alt={selectedImage.title || '圖片'}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                {selectedImage.title}
              </Typography>
              {selectedImage.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedImage.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Chip label={selectedImage.category} color="primary" />
                {selectedImage.year && (
                  <Chip label={`${selectedImage.year}年`} variant="outlined" />
                )}
                {selectedImage.date && (
                  <Chip label={selectedImage.date} variant="outlined" />
                )}
              </Stack>
            </Box>
          </>
        )}
      </Dialog>
    </>
  );
}

