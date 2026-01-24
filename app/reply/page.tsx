'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Trash2, Lock } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  author?: string | null;
  isPublic: boolean;
  createdAt: string;
}

export default function ReplyPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(logged);
    setIsAdmin(admin);
    setCheckedAuth(true);
    if (!logged) {
      router.push('/login');
    }
  }, [router]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?isAdmin=true`);
      const result = await response.json();
      if (result.success) {
        setMessages(result.data || []);
      }
    } catch (error) {
      console.error('獲取留言錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkedAuth && isLoggedIn) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedAuth, isLoggedIn]);

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      setSnackbar({ open: true, message: '只有管理員可以刪除留言', severity: 'error' });
      return;
    }
    if (!confirm('確定要刪除這則留言嗎？')) return;
    try {
      const response = await fetch(`/api/messages?id=${id}&isAdmin=true`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result.success) {
        setSnackbar({ open: true, message: '已刪除留言', severity: 'success' });
        fetchMessages();
      } else {
        setSnackbar({ open: true, message: result.error || '刪除失敗', severity: 'error' });
      }
    } catch (error) {
      console.error('刪除留言錯誤:', error);
      setSnackbar({ open: true, message: '刪除失敗，請稍後再試', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  if (!checkedAuth || (!isLoggedIn && typeof window !== 'undefined')) {
    return null;
  }

  // 聯絡與推薦連結與首頁一致
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation currentPage="reply" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            留言反饋列表
          </Typography>

          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              minHeight: 300,
            }}
            elevation={2}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                目前尚無留言
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => (
                  <Paper
                    key={msg.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      position: 'relative',
                      borderRadius: 2,
                    }}
                  >
                    {isAdmin && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(msg.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'error.main',
                        }}
                        aria-label="刪除留言"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      {!msg.isPublic && <Lock size={14} style={{ color: 'rgba(0,0,0,0.6)' }} />}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.createdAt).toLocaleString('zh-TW')}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}




