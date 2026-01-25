'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import { Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { event } from '@/lib/gtag';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const showLanding = !showAdvanced;


  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 帳號與密碼均為 admin
    const isValid = username === 'admin' && password === 'admin';

    if (isValid) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('isAdmin', 'true');
      // 觸發 storage 事件讓 Navigation 立即更新
      window.dispatchEvent(new Event('storage'));
      event({
        action: 'login',
        category: 'authentication',
        label: 'success',
      });
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } else {
      setError('帳號或密碼錯誤');
      event({
        action: 'login',
        category: 'authentication',
        label: 'failure',
      });
    }
  };

  const handleUserIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId.trim()) {
      setError('請輸入使用者 ID');
      return;
    }

    if (userId.length > 15) {
      setError('使用者 ID 必須小於 15 字元');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '設定失敗');
        setLoading(false);
        return;
      }

      // 確保導覽列顯示登入狀態（與原本 localStorage 檢查一致）
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('isAdmin', 'true');
      // 觸發 storage 事件讓 Navigation 立即更新
      window.dispatchEvent(new Event('storage'));
      event({
        action: 'set_user_id',
        category: 'authentication',
        label: 'success',
      });

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('設定時發生錯誤，請稍後再試');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      <Navigation currentPage="login" />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
          bgcolor: '#000000',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '520px', px: 3 }}>
          <Card
            sx={{
              bgcolor: 'white',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              pb: 4,
            }}
          >
            {/* 登入標題 - 鎖圖標與文字 */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, pt: 6, pb: 2 }}>
              <Lock style={{ width: '32px', height: '32px', color: '#2563eb' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                登入
              </Typography>
            </Box>

            <CardContent sx={{ px: 4, pb: 12, '& > * + *': { mt: 3 } }}>
              {/* 錯誤訊息 */}
              {error && (
                <Alert
                  severity="error"
                  icon={<AlertCircle style={{ width: '20px', height: '20px' }} />}
                  sx={{ mb: 3 }}
                >
                  {error}
                </Alert>
              )}


              {showLanding && (
                <>
                  {/* 帳號密碼登入表單 */}
                  <Box component="form" onSubmit={handleCredentialSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                          帳號
                        </Typography>
                      </Box>
                      <TextField
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="請輸入帳號"
                        fullWidth
                        size="small"
                        sx={{
                          bgcolor: '#f3f4f6',
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#f3f4f6',
                            '& fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#d1d5db',
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Lock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                          密碼
                        </Typography>
                      </Box>
                      <TextField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="請輸入密碼"
                        fullWidth
                        size="small"
                        sx={{
                          bgcolor: '#f3f4f6',
                          '& .MuiOutlinedInput-root': {
                            bgcolor: '#f3f4f6',
                            '& fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: '#d1d5db',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#d1d5db',
                            },
                          },
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: '#2563eb',
                        color: 'white',
                        height: '44px',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: '#1d4ed8',
                        },
                      }}
                    >
                      登入
                    </Button>
                  </Box>
                </>
              )}

              {/* 進階選項（使用者 ID 設定）- 預設隱藏 */}
              {showAdvanced && (
                <>
                  {/* 使用者 ID 設定 */}
                  <Box sx={{ pt: 3, borderTop: '1px solid #e5e7eb' }}>
                    <Box component="form" onSubmit={handleUserIdSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'center' }}>
                          <Mail style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                            使用者 ID (最多 15 字元)
                          </Typography>
                        </Box>
                        <TextField
                          id="userId"
                          type="text"
                          inputProps={{ maxLength: 15 }}
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          placeholder="請設定您的使用者 ID"
                          disabled={loading}
                          fullWidth
                          size="small"
                          sx={{
                            bgcolor: '#f3f4f6',
                            textAlign: 'center',
                            '& .MuiOutlinedInput-root': {
                              bgcolor: '#f3f4f6',
                              '& fieldset': {
                                borderColor: '#d1d5db',
                              },
                              '&:hover fieldset': {
                                borderColor: '#d1d5db',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#d1d5db',
                              },
                              '& input': {
                                textAlign: 'center',
                                color: '#000000',
                              },
                            },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#6b7280', textAlign: 'center', width: '100%' }}>
                          已輸入 {userId.length} / 15 字元
                        </Typography>
                      </Box>
                      <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: '#2563eb',
                          color: 'white',
                          height: '44px',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#1d4ed8',
                          },
                        }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
                            設定中...
                          </>
                        ) : (
                          '設定使用者 ID'
                        )}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
