'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { Trash2, Plus, ArrowLeft, ArrowRight, Upload, Edit } from 'lucide-react';

interface CarouselImage {
  id?: string;
  url: string;
  publicId?: string | null;
  order?: number;
}

interface InstagramPost {
  id?: string;
  url: string;
  name?: string | null;
  description?: string | null;
  order?: number;
}

export default function EditPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyVisual, setKeyVisual] = useState<{ id?: string; url: string; publicId?: string | null } | null>(null);
  const [keyVisualPage, setKeyVisualPage] = useState<'home' | 'bible'>('home');
  const [schedule, setSchedule] = useState<{ id?: string; url: string; publicId?: string | null } | null>(null);
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedKeyVisualFile, setSelectedKeyVisualFile] = useState<File | null>(null);
  const [selectedScheduleFile, setSelectedScheduleFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [instagramDialogOpen, setInstagramDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramName, setInstagramName] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [deleteKeyVisualConfirmOpen, setDeleteKeyVisualConfirmOpen] = useState(false);
  const [deleteScheduleConfirmOpen, setDeleteScheduleConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [bibleTopicName, setBibleTopicName] = useState('');
  const [bibleTopicIntro, setBibleTopicIntro] = useState('');
  const [bibleActivityInfo, setBibleActivityInfo] = useState('');
  const [bibleSignupInfo, setBibleSignupInfo] = useState('');

  // 處理 Dialog 打開/關閉時的滾動控制
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (previewImage) {
      // Dialog 打開時：保持滾動條顯示，但禁用滾動功能
      // 使用 overflow: hidden 會隱藏滾動條，所以改用 position: fixed 來阻止滾動
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      // 保存當前滾動位置
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Dialog 關閉時：恢復滾動
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.removeAttribute('data-scroll-y');
      // 恢復滾動位置
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    }
    
    // 清理函數：確保組件卸載時恢復滾動
    return () => {
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.removeAttribute('data-scroll-y');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
      }
    };
  }, [previewImage]);
  
  // 處理 Dialog 關閉
  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  useEffect(() => {
    // 檢查登入狀態
    const checkLogin = () => {
      if (typeof window !== 'undefined') {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        if (!loggedIn) {
          router.push('/login');
        } else {
          fetchKeyVisual();
          fetchSchedule();
          fetchImages();
          fetchInstagramPosts();
        }
      }
    };
    checkLogin();
  }, [router]);

  const fetchKeyVisual = async () => {
    try {
      const response = await fetch('/api/keyvisual');
      const result = await response.json();
      if (result.success) {
        setKeyVisual(result.data || null);
      } else {
        setKeyVisual(null);
      }
    } catch (err) {
      console.error('獲取主視覺圖片錯誤:', err);
      setKeyVisual(null);
    }
  };

  const handleOpenPreview = (url: string, title: string) => {
    setPreviewImage({ url, title });
  };

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/schedule');
      const result = await response.json();
      if (result.success) {
        setSchedule(result.data || null);
      } else {
        setSchedule(null);
      }
    } catch (err) {
      console.error('獲取活動日程表錯誤:', err);
      setSchedule(null);
    }
  };

  const fetchImages = async ({ skipLoading = false } = {}) => {
    if (!skipLoading) {
      setLoading(true);
    }
    try {
      const response = await fetch('/api/carousel');
      const result = await response.json();
      if (result.success) {
        setImages(result.data || []);
      } else {
        setError(result.error || '獲取圖片失敗');
      }
    } catch (err) {
      console.error('獲取圖片錯誤:', err);
      setError('獲取圖片失敗');
    } finally {
      if (!skipLoading) {
        setLoading(false);
      }
    }
  };

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/instagram');
      const result = await response.json();
      if (result.success) {
        setInstagramPosts(result.data || []);
      }
    } catch (err) {
      console.error('獲取 Instagram 貼文錯誤:', err);
    }
  };

  const handleAddKeyVisual = () => {
    setSelectedKeyVisualFile(null);
    const input = document.getElementById('upload-keyvisual-image') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  };

  const handleKeyVisualFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('只能上傳圖片檔案');
        return;
      }
      setSelectedKeyVisualFile(file);
      setError('');
      
      try {
        setUploading(true);
        setLoadingMessage('上傳主視覺圖片中...');
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          setError(uploadResult.error || '上傳失敗');
          setUploading(false);
          setLoadingMessage('');
          return;
        }

        // 保存主視覺圖片
        const saveResponse = await fetch('/api/keyvisual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadResult.data.url,
            publicId: uploadResult.data.publicId,
          }),
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          await fetchKeyVisual();
        } else {
          setError(saveResult.error || '保存失敗');
        }
      } catch (err) {
        console.error('上傳主視覺圖片錯誤:', err);
        setError('上傳主視覺圖片失敗');
      } finally {
        setUploading(false);
        setLoadingMessage('');
        setSelectedKeyVisualFile(null);
      }
    }
  };

  const handleDeleteKeyVisual = () => {
    setDeleteKeyVisualConfirmOpen(true);
  };

  const handleConfirmDeleteKeyVisual = async () => {
    if (!keyVisual?.id) return;
    
    setDeleteKeyVisualConfirmOpen(false);

    try {
      setDeleting(true);
      setLoadingMessage('刪除中...');
      const response = await fetch(`/api/keyvisual?id=${keyVisual.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        await fetchKeyVisual();
      } else {
        setError(result.error || '刪除失敗');
      }
    } catch (err) {
      console.error('刪除主視覺圖片錯誤:', err);
      setError('刪除主視覺圖片失敗');
    } finally {
      setDeleting(false);
      setLoadingMessage('');
    }
  };

  const handleAddSchedule = () => {
    setSelectedScheduleFile(null);
    const input = document.getElementById('upload-schedule-image') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  };

  const handleScheduleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('只能上傳圖片檔案');
        return;
      }
      setSelectedScheduleFile(file);
      setError('');
      
      try {
        setUploading(true);
        setLoadingMessage('上傳活動日程表中...');
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          setError(uploadResult.error || '上傳失敗');
          setUploading(false);
          setLoadingMessage('');
          return;
        }

        // 保存活動日程表
        const saveResponse = await fetch('/api/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadResult.data.url,
            publicId: uploadResult.data.publicId,
          }),
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          await fetchSchedule();
        } else {
          setError(saveResult.error || '保存失敗');
        }
      } catch (err) {
        console.error('上傳活動日程表錯誤:', err);
        setError('上傳活動日程表失敗');
      } finally {
        setUploading(false);
        setLoadingMessage('');
        setSelectedScheduleFile(null);
      }
    }
  };

  const handleDeleteSchedule = () => {
    setDeleteScheduleConfirmOpen(true);
  };

  const handleConfirmDeleteSchedule = async () => {
    if (!schedule?.id) return;
    
    setDeleteScheduleConfirmOpen(false);

    try {
      setDeleting(true);
      setLoadingMessage('刪除中...');
      const response = await fetch(`/api/schedule?id=${schedule.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        await fetchSchedule();
      } else {
        setError(result.error || '刪除失敗');
      }
    } catch (err) {
      console.error('刪除活動日程表錯誤:', err);
      setError('刪除活動日程表失敗');
    } finally {
      setDeleting(false);
      setLoadingMessage('');
    }
  };

  const handleAddImage = () => {
    setSelectedFile(null);
    // 直接觸發文件選擇，不打開對話框
    const input = document.getElementById('upload-image-new') as HTMLInputElement;
    if (input) {
      input.value = ''; // 重置以允許選擇相同文件
      input.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('只能上傳圖片檔案');
        return;
      }
      setSelectedFile(file);
      setError('');
      
      // 直接上傳並保存
      try {
        setUploading(true);
        setLoadingMessage('上傳中...');
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          setLoadingMessage('儲存中...');
          // 直接保存到資料庫（後端會自動將新照片設為最後一張）
          const response = await fetch('/api/carousel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: uploadResult.data.url, 
              publicId: uploadResult.data.publicId 
            }),
          });
          const result = await response.json();
          if (result.success) {
            await fetchImages({ skipLoading: true });
            setSelectedFile(null);
          } else {
            setError(result.error || '新增圖片失敗');
          }
        } else {
          setError(uploadResult.error || '上傳失敗');
        }
      } catch (err) {
        console.error('上傳圖片錯誤:', err);
        setError('上傳圖片時發生錯誤');
      } finally {
        setUploading(false);
        setLoadingMessage('');
        setSelectedFile(null);
      }
    }
  };


  const handleDeleteImage = (id: string) => {
    setDeletingImageId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingImageId) return;

    setDeleteConfirmOpen(false);
    
    try {
      setDeleting(true);
      setLoadingMessage('刪除中...');
      
      const response = await fetch(`/api/carousel?id=${deletingImageId}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setImages(images.filter((img) => img.id !== deletingImageId));
      } else {
        setError(result.error || '刪除圖片失敗');
      }
    } catch (err) {
      console.error('刪除圖片錯誤:', err);
      setError('刪除圖片失敗');
    } finally {
      setDeleting(false);
      setLoadingMessage('');
      setDeletingImageId(null);
    }
  };

  const handleMoveLeft = async (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    
    // 更新順序到 API
    try {
      const updates = newImages.map((img, idx) => ({
        id: img.id,
        order: idx,
      }));
      
      // 批量更新順序
      await Promise.all(
        updates.map((update) =>
          fetch('/api/carousel', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: update.id, order: update.order }),
          })
        )
      );
      
      setImages(newImages);
    } catch (err) {
      console.error('更新順序錯誤:', err);
      setError('更新順序失敗');
    }
  };

  const handleMoveRight = async (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    
    // 更新順序到 API
    try {
      const updates = newImages.map((img, idx) => ({
        id: img.id,
        order: idx,
      }));
      
      // 批量更新順序
      await Promise.all(
        updates.map((update) =>
          fetch('/api/carousel', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: update.id, order: update.order }),
          })
        )
      );
      
      setImages(newImages);
    } catch (err) {
      console.error('更新順序錯誤:', err);
      setError('更新順序失敗');
    }
  };

  const handleAddInstagramPost = () => {
    setEditingPost(null);
    setInstagramUrl('');
    setInstagramName('');
    setInstagramDialogOpen(true);
  };

  const handleEditInstagramPost = (post: InstagramPost) => {
    setEditingPost(post);
    setInstagramUrl(post.url);
    setInstagramName(post.name || '');
    setInstagramDialogOpen(true);
  };

  const handleSaveInstagramPost = async () => {
    if (!instagramUrl.trim()) {
      setError('請輸入 Instagram 貼文 URL');
      return;
    }

    try {
      setLoadingMessage('儲存中...');
      setDeleting(true);

      if (editingPost?.id) {
        // 更新現有貼文
        const response = await fetch('/api/instagram', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: editingPost.id, 
            url: instagramUrl, 
            name: instagramName,
          }),
        });
        const result = await response.json();
        if (result.success) {
          await fetchInstagramPosts();
        } else {
          setError(result.error || '更新貼文失敗');
        }
      } else {
        // 新增貼文
        const response = await fetch('/api/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: instagramUrl, 
            name: instagramName,
            order: instagramPosts.length 
          }),
        });
        const result = await response.json();
        if (result.success) {
          await fetchInstagramPosts();
        } else {
          setError(result.error || '新增貼文失敗');
        }
      }

      setInstagramDialogOpen(false);
      setInstagramUrl('');
      setInstagramName('');
      setEditingPost(null);
    } catch (err) {
      console.error('儲存 Instagram 貼文錯誤:', err);
      setError('儲存貼文失敗');
    } finally {
      setDeleting(false);
      setLoadingMessage('');
    }
  };

  const handleDeleteInstagramPost = async (id: string) => {
    if (!confirm('確定要刪除這個 Instagram 貼文嗎？')) return;

    try {
      setDeleting(true);
      setLoadingMessage('刪除中...');

      const response = await fetch(`/api/instagram?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setInstagramPosts(instagramPosts.filter((post) => post.id !== id));
      } else {
        setError(result.error || '刪除貼文失敗');
      }
    } catch (err) {
      console.error('刪除 Instagram 貼文錯誤:', err);
      setError('刪除貼文失敗');
    } finally {
      setDeleting(false);
      setLoadingMessage('');
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
      <Navigation currentPage="admin" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <Button
              variant={keyVisualPage === 'home' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setKeyVisualPage('home')}
            >
              主頁
            </Button>
            <Button
              variant={keyVisualPage === 'bible' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setKeyVisualPage('bible')}
            >
              神研班頁面
            </Button>
          </Stack>

          {keyVisualPage === 'home' ? (
            <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                輪播圖片
              </Typography>
              <Button
                variant="text"
                startIcon={<Plus />}
                onClick={handleAddImage}
                sx={{
                  textTransform: 'none',
                }}
              >
                新增圖片
              </Button>
            </Box>

            {images.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                目前尚無圖片，點擊「新增圖片」開始添加
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.id || index}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={image.url}
                        alt={`照片 ${index + 1}`}
                        sx={{
                          aspectRatio: '16/9',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        照片 {index + 1}
                      </Box>
                    </Box>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handleMoveLeft(index)}
                          disabled={index === 0}
                          aria-label="向左移動"
                        >
                          <ArrowLeft />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveRight(index)}
                          disabled={index === images.length - 1}
                          aria-label="向右移動"
                        >
                          <ArrowRight />
                        </IconButton>
                      </Stack>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => image.id && handleDeleteImage(image.id)}
                        aria-label="刪除"
                      >
                        <Trash2 />
                      </IconButton>
                    </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* Instagram 貼文管理 */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Instagram 貼文管理
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Plus />}
                onClick={handleAddInstagramPost}
                sx={{
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                新增貼文
              </Button>
            </Box>

            {instagramPosts.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                目前尚無 Instagram 貼文，點擊「新增貼文」開始添加
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {instagramPosts.map((post, index) => (
                      <Grid size={{ xs: 12, sm: 3, md: 3 }} key={post.id || index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        pl: 3,
                        pr: 0.5,
                        py: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        minHeight: 60,
                        width: '100%',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          flex: '1 1 auto',
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mr: 1,
                        }}
                      >
                        {post.name || `貼文 ${index + 1}`}
                      </Typography>
                      <Box sx={{ flexShrink: 0 }}>
                        <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditInstagramPost(post)}
                          aria-label="編輯"
                          disableRipple
                          disableFocusRipple
                        >
                            <Edit />
                          </IconButton>
                          <IconButton
                          size="small"
                          color="error"
                          onClick={() => post.id && handleDeleteInstagramPost(post.id)}
                          aria-label="刪除"
                          disableRipple
                          disableFocusRipple
                        >
                            <Trash2 />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
            </>
          ) : (
            <>
              <Grid container columnSpacing={2} rowSpacing={5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        主視覺圖片
                      </Typography>
                      {keyVisual && (
                        <IconButton
                          color="error"
                          onClick={handleDeleteKeyVisual}
                          aria-label="刪除主視覺圖片"
                        >
                          <Trash2 />
                        </IconButton>
                      )}
                    </Box>
                    {keyVisual ? (
                      <Box
                        component="img"
                        src={keyVisual.url}
                        alt="主視覺"
                        onClick={() => handleOpenPreview(keyVisual.url, '主視覺圖片')}
                        sx={{
                          width: '100%',
                          height: 260,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2,
                          cursor: 'pointer',
                        }}
                      />
                    ) : (
                      <Box
                        onClick={handleAddKeyVisual}
                        sx={{
                          width: '100%',
                          minHeight: 200,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '2px dashed rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            borderColor: 'rgba(0, 0, 0, 0.5)',
                          },
                        }}
                      >
                        <Box sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.5)' }}>
                          <Upload size={48} />
                        </Box>
                        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                          點擊上傳主視覺圖片
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: 6, md: 0 } }}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">
                        活動日程表
                      </Typography>
                      {schedule && (
                        <IconButton
                          color="error"
                          onClick={handleDeleteSchedule}
                          aria-label="刪除活動日程表"
                        >
                          <Trash2 />
                        </IconButton>
                      )}
                    </Box>
                    {schedule ? (
                      <Box
                        component="img"
                        src={schedule.url}
                        alt="活動日程表"
                        onClick={() => handleOpenPreview(schedule.url, '活動日程表')}
                        sx={{
                          width: '100%',
                          height: 260,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2,
                          cursor: 'pointer',
                        }}
                      />
                    ) : (
                      <Box
                        onClick={handleAddSchedule}
                        sx={{
                          width: '100%',
                          minHeight: 200,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '2px dashed rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            borderColor: 'rgba(0, 0, 0, 0.5)',
                          },
                        }}
                      >
                        <Box sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.5)' }}>
                          <Upload size={48} />
                        </Box>
                        <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                          點擊上傳活動日程表
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Stack spacing={3}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    主題名稱
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="請輸入主題名稱"
                    value={bibleTopicName}
                    onChange={(e) => setBibleTopicName(e.target.value)}
                  />
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    主題介紹
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="請輸入主題介紹"
                    value={bibleTopicIntro}
                    onChange={(e) => setBibleTopicIntro(e.target.value)}
                  />
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    活動資訊
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="請輸入活動資訊"
                    value={bibleActivityInfo}
                    onChange={(e) => setBibleActivityInfo(e.target.value)}
                  />
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    報名資訊
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="請輸入報名資訊"
                    value={bibleSignupInfo}
                    onChange={(e) => setBibleSignupInfo(e.target.value)}
                  />
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    神研班主題
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 120,
                      border: '2px dashed rgba(0,0,0,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(0,0,0,0.65)',
                      bgcolor: 'background.paper',
                      px: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body1">
                      {bibleTopicName || '尚未輸入主題名稱'}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    主題介紹
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 120,
                      border: '2px dashed rgba(0,0,0,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(0,0,0,0.65)',
                      bgcolor: 'background.paper',
                      px: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body1">
                      {bibleTopicIntro || '尚未輸入主題介紹'}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    活動資訊
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 120,
                      border: '2px dashed rgba(0,0,0,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(0,0,0,0.65)',
                      bgcolor: 'background.paper',
                      px: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body1">
                      {bibleActivityInfo || '尚未輸入活動資訊'}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    報名資訊
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 120,
                      border: '2px dashed rgba(0,0,0,0.2)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(0,0,0,0.65)',
                      bgcolor: 'background.paper',
                      px: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body1">
                      {bibleSignupInfo || '尚未輸入報名資訊'}
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </>
          )}
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />

      {/* 隱藏的文件輸入，用於新增主視覺圖片 */}
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-keyvisual-image"
        type="file"
        onChange={handleKeyVisualFileSelect}
      />
      {/* 隱藏的文件輸入，用於新增圖片 */}
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-image-new"
        type="file"
        onChange={handleFileSelect}
      />
      {/* 隱藏的文件輸入，用於新增活動日程表 */}
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-schedule-image"
        type="file"
        onChange={handleScheduleFileSelect}
      />

      {/* 刪除輪播圖片確認對話框 */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDeletingImageId(null);
        }}
        aria-labelledby="delete-confirm-dialog-title"
        PaperProps={{
          sx: {
            minWidth: 300,
            textAlign: 'center',
            p: 3,
          },
        }}
      >
        <DialogTitle id="delete-confirm-dialog-title" sx={{ pb: 1 }}>
          確定要刪除這張照片嗎？
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setDeletingImageId(null);
            }}
            variant="outlined"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            確定刪除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除主視覺圖片確認對話框 */}
      <Dialog
        open={deleteKeyVisualConfirmOpen}
        onClose={() => {
          setDeleteKeyVisualConfirmOpen(false);
        }}
        aria-labelledby="delete-keyvisual-confirm-dialog-title"
        PaperProps={{
          sx: {
            minWidth: 300,
            textAlign: 'center',
            p: 3,
          },
        }}
      >
        <DialogTitle id="delete-keyvisual-confirm-dialog-title" sx={{ pb: 1 }}>
          確定要刪除主視覺圖片嗎？
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
          <Button
            onClick={() => {
              setDeleteKeyVisualConfirmOpen(false);
            }}
            variant="outlined"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirmDeleteKeyVisual}
            variant="contained"
            color="error"
          >
            確定刪除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除活動日程表確認對話框 */}
      <Dialog
        open={deleteScheduleConfirmOpen}
        onClose={() => {
          setDeleteScheduleConfirmOpen(false);
        }}
        aria-labelledby="delete-schedule-confirm-dialog-title"
        PaperProps={{
          sx: {
            minWidth: 300,
            textAlign: 'center',
            p: 3,
          },
        }}
      >
        <DialogTitle id="delete-schedule-confirm-dialog-title" sx={{ pb: 1 }}>
          確定要刪除活動日程表嗎？
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pt: 2 }}>
          <Button
            onClick={() => {
              setDeleteScheduleConfirmOpen(false);
            }}
            variant="outlined"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirmDeleteSchedule}
            variant="contained"
            color="error"
          >
            確定刪除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 載入對話框 */}
      <Dialog
        open={uploading || deleting}
        aria-labelledby="loading-dialog-title"
        PaperProps={{
          sx: {
            minWidth: 200,
            textAlign: 'center',
            p: 3,
          },
        }}
      >
        <DialogTitle id="loading-dialog-title" sx={{ pb: 1 }}>
          {loadingMessage}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 0 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>

      {/* 預覽對話框 */}
      <Dialog
        open={!!previewImage}
        onClose={handleClosePreview}
        maxWidth={false}
        fullWidth
        disableScrollLock={true} // 禁用 MUI 的 scroll lock，我們手動處理滾動
        PaperProps={{
          sx: {
            maxWidth: '95vw',
            width: '100%',
            maxHeight: '90vh',
            m: 2,
            // 移除 Paper 的邊框和輪廓
            border: 'none',
            outline: 'none',
          },
        }}
        sx={{
          // 移除 Dialog 容器右側可能的黑色線條
          '& .MuiDialog-container': {
            // 不設置 border，只移除可能的背景色問題
          },
        }}
      >
        {previewImage && (
          <>
            <DialogTitle>{previewImage.title}</DialogTitle>
            <DialogContent 
              sx={{ 
                px: 0, // 移除左右 padding，讓滾動條緊貼右邊
                py: 5,
                maxHeight: 'calc(90vh - 120px)',
                overflowY: 'auto', // 只在需要時顯示滾動條
                overflowX: 'hidden',
                position: 'relative',
                // 移除 dividers 的邊框
                borderTop: 'none',
                borderBottom: 'none',
                borderRight: 'none', // 移除右側邊框
                borderLeft: 'none', // 移除左側邊框
                // Firefox 滾動條樣式 - 只在需要時顯示
                scrollbarWidth: 'auto',
                scrollbarColor: 'rgba(0, 0, 0, 0.3) transparent',
                // 不使用 scrollbar-gutter，讓滾動條覆蓋在內容上
                // WebKit 滾動條樣式 - 深色滾動條，固定在右邊，覆蓋在內容上
                '&::-webkit-scrollbar': {
                  width: '16px',
                  backgroundColor: 'transparent', // 透明背景
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent', // 透明軌道
                  borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  border: 'none',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                // 完全移除滾動條的所有按鈕和邊角
                '&::-webkit-scrollbar-button': {
                  display: 'none',
                  width: 0,
                  height: 0,
                },
                '&::-webkit-scrollbar-corner': {
                  display: 'none',
                },
              }}
              style={{
                direction: 'ltr', // 確保滾動條在右邊
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  px: 10, // 圖片內容的左右 padding
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  // 確保內容寬度不受滾動條影響
                  boxSizing: 'border-box',
                }}
              >
                <Box
                  component="img"
                  src={previewImage.url}
                  alt={previewImage.title}
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    // 確保圖片寬度不受滾動條影響
                    boxSizing: 'border-box',
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewImage(null)}>關閉</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Instagram 貼文編輯對話框 */}
      <Dialog 
        open={instagramDialogOpen} 
        onClose={() => setInstagramDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter' && instagramUrl.trim() && !e.shiftKey) {
            e.preventDefault();
            handleSaveInstagramPost();
          }
        }}
      >
        <DialogTitle>
          {editingPost ? '編輯 Instagram 貼文' : '新增 Instagram 貼文'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="貼文名稱"
              fullWidth
              value={instagramName}
              onChange={(e) => setInstagramName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && instagramUrl.trim() && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveInstagramPost();
                }
              }}
              placeholder="輸入貼文名稱（選填）"
              helperText="為這個貼文設定一個名稱，方便識別"
            />
            <TextField
              label="Instagram 貼文 URL"
              fullWidth
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && instagramUrl.trim() && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveInstagramPost();
                }
              }}
              placeholder="https://www.instagram.com/p/ABC123/ 或 https://www.instagram.com/reel/ABC123/"
              helperText="請貼上 Instagram 貼文或 Reel 的完整 URL，系統會自動抓取貼文文字敘述"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstagramDialogOpen(false)}>取消</Button>
          <Button
            onClick={handleSaveInstagramPost}
            variant="contained"
            disabled={!instagramUrl.trim()}
          >
            {editingPost ? '儲存' : '新增'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

