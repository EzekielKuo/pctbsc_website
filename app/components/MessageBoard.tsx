'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Divider,
  CircularProgress,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Send, Trash2, Globe2, Lock } from 'lucide-react';
import { event } from '@/lib/gtag';

interface Message {
  id: string;
  content: string;
  author?: string | null;
  isPublic: boolean;
  createdAt: string;
}

export default function MessageBoard() {
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true); // 預設為公開
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 檢查是否為 admin
  useEffect(() => {
    const checkAdminStatus = () => {
      if (typeof window !== 'undefined') {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      }
    };

    // 初始檢查（立即執行）
    if (typeof window !== 'undefined') {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    }

    // 監聽 storage 變化（跨標籤頁同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAdmin' || e.key === 'isLoggedIn') {
        checkAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期檢查（處理同標籤頁的變化）
    const interval = setInterval(checkAdminStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 獲取留言列表
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?isAdmin=${isAdmin}`);
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

  // 當 isAdmin 狀態改變時重新獲取留言
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // 定期自動更新留言列表（每 10 秒檢查一次）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 10000); // 10 秒更新一次

    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 驗證字數限制（最多500字）
    if (message.length > 500) {
      setSnackbar({
        open: true,
        message: '留言內容不能超過500字',
        severity: 'error',
      });
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, isPublic }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('');
        setIsPublic(true); // 重置為公開
        setSnackbar({
          open: true,
          message: '留言已成功送出！',
          severity: 'success',
        });
        // 追蹤 GA4 事件
        event({
          action: 'submit',
          category: 'message',
          label: isPublic ? '公開留言' : '不公開留言',
        });
        // 刷新留言列表
        fetchMessages();
      } else {
        setSnackbar({
          open: true,
          message: result.error || '提交留言失敗，請稍後再試',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('提交留言錯誤:', error);
      setSnackbar({
        open: true,
        message: '提交留言失敗，請稍後再試',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = async (messageId: string) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: '權限不足，只有管理員可以刪除留言',
        severity: 'error',
      });
      return;
    }

    if (!confirm('確定要刪除這則留言嗎？')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages?id=${messageId}&isAdmin=${isAdmin}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSnackbar({
          open: true,
          message: '留言已成功刪除！',
          severity: 'success',
        });
        // 刷新留言列表
        fetchMessages();
      } else {
        setSnackbar({
          open: true,
          message: result.error || '刪除留言失敗，請稍後再試',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('刪除留言錯誤:', error);
      setSnackbar({
        open: true,
        message: '刪除留言失敗，請稍後再試',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        py: 2,
        pb: { xs: 4, md: 2 },
        background: 'linear-gradient(to bottom, rgba(255, 182, 193, 0.3), rgba(221, 160, 221, 0.3))',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            maxWidth: '1400px',
            mx: 'auto',
            height: { xs: 'auto', md: '350px' },
            minHeight: { xs: '350px', md: '350px' },
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* 左側：新增留言表單 */}
          <Box sx={{ flex: '1 1 50%', display: 'flex', height: { xs: 'auto', md: '100%' }, minHeight: { xs: '200px', md: 'auto' } }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                align="center"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                新增留言......
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="輸入留言內容..."
                  value={message}
                  onChange={(e) => {
                    // 限制輸入長度為500字
                    const newValue = e.target.value.slice(0, 500);
                    setMessage(newValue);
                  }}
                  inputProps={{
                    maxLength: 500,
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      borderColor: 'primary.light',
                      maxHeight: '180px',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputBase-input': {
                      resize: 'vertical',
                      maxHeight: '180px',
                      overflowY: 'auto',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <ToggleButtonGroup
                    value={isPublic}
                    exclusive
                    onChange={(e, newValue) => {
                      if (newValue !== null) {
                        setIsPublic(newValue);
                      }
                    }}
                    aria-label="留言類型"
                    size="small"
                  >
                    <ToggleButton value={true} aria-label="公開留言">
                      <Globe2 style={{ marginRight: 4, width: 16, height: 16 }} />
                      公開留言
                    </ToggleButton>
                    <ToggleButton value={false} aria-label="不公開留言">
                      <Lock style={{ marginRight: 4, width: 16, height: 16 }} />
                      不公開留言
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button
                    type="submit"
                    variant="outlined"
                    size="small"
                    startIcon={<Send size={16} />}
                    sx={{
                      borderWidth: 2,
                      px: 2.5,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      '&:hover': { borderWidth: 2 },
                    }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* 右側：留言列表 */}
          <Box sx={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', height: { xs: 'auto', md: '100%' }, minHeight: { xs: '150px', md: 'auto' } }}>
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.3)',
                  },
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : messages.length === 0 ? (
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    尚無留言，成為第一個留言的人吧！
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {messages.map((msg) => (
                    <Paper
                      key={msg.id}
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'white',
                        position: 'relative',
                        '&:hover .delete-button': {
                          opacity: 1,
                        },
                      }}
                    >
                      {isAdmin && (
                        <IconButton
                          className="delete-button"
                          size="small"
                          onClick={() => handleDelete(msg.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.light',
                              color: 'error.dark',
                            },
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                      {msg.author && (
                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: 'primary.main',
                            }}
                          >
                            {msg.author}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            flex: 1,
                          }}
                        >
                          {msg.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                          {!msg.isPublic && (
                            <Lock style={{ width: 14, height: 14, color: 'rgba(0,0,0,0.6)' }} />
                          )}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleString('zh-TW', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
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

