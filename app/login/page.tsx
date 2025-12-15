'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { event } from '@/lib/gtag';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 驗證帳號密碼
    // 支援 admin 帳號：帳號 admin，密碼 admin
    const isAdmin = username === 'admin' && password === 'admin';
    const isGuest = username === '' && password === '';

    if (isAdmin || isGuest) {
      // 登入成功，儲存登入狀態和時間戳記
      const loginTime = Date.now();
      const loggedInUsername = isAdmin ? 'admin' : username;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', loggedInUsername);
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      localStorage.setItem('loginTime', loginTime.toString());
      
      // 追蹤登入成功
      event({
        action: 'login',
        category: 'authentication',
        label: 'success',
      });
      
      // 延遲一下再跳轉，讓使用者看到成功訊息
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } else {
      // 追蹤登入失敗
      event({
        action: 'login',
        category: 'authentication',
        label: 'failure',
      });
      setError('帳號或密碼錯誤');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      if (form && form.tagName === 'FORM') {
        form.requestSubmit();
      }
    }
  };

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
      <Navigation currentPage="login" />
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '50%',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
              登入
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              請輸入您的帳號和密碼以登入系統
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              onKeyDown={handleKeyDown}
              sx={{ width: '100%' }}
            >
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <TextField
                  label="帳號"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />

                <TextField
                  label="密碼"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mt: 2,
                  }}
                >
                  {loading ? '登入中...' : '登入'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer contactInfo={contactInfo} links={links} />
    </Box>
  );
}

