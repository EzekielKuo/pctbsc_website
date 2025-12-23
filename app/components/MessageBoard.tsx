'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import { Send } from 'lucide-react';
import { event } from '@/lib/gtag';

export default function MessageBoard() {
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, isPublic: true }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('');
        setSnackbar({
          open: true,
          message: '留言已成功送出！',
          severity: 'success',
        });
        // 追蹤 GA4 事件
        event({
          action: 'submit',
          category: 'message',
          label: '留言反饋',
        });
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

  return (
    <Box
      sx={{
        position: 'relative',
        py: 2,
        pb: { xs: 4, md: 2 },
        backgroundColor: '#000',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 3 },
              borderRadius: 3,
              bgcolor: '#000', // 黑色底
              color: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'none',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                backgroundColor: '#000',
                outline: 'none',
              },
            }}
          >
            <Typography variant="h5" component="h2" align="center" sx={{ fontWeight: 700, color: 'white' }}>
              留言反饋
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                multiline
                rows={6}
                fullWidth
                placeholder="輸入留言內容..."
                value={message}
                onChange={(e) => {
                  const newValue = e.target.value.slice(0, 500);
                  setMessage(newValue);
                }}
                inputProps={{ maxLength: 500 }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.8)', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.8)', borderWidth: 2 },
                    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.8)', borderWidth: 2 },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                    resize: 'vertical',
                    maxHeight: '180px',
                    overflowY: 'auto',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="text"
                  startIcon={<Send size={16} />}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#42a5f5',
                    '&:hover': { backgroundColor: 'transparent', color: '#2196f3' },
                    '&:focus-visible': { outline: 'none' },
                  }}
                >
                  送出
                </Button>
              </Box>
            </Box>
          </Paper>
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

