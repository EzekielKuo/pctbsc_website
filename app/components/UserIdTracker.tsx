'use client';

import { useEffect } from 'react';
import { setUserId } from '@/lib/gtag';

export default function UserIdTracker() {
  useEffect(() => {
    // 檢查是否有登入用戶
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      
      if (isLoggedIn && username) {
        // 設定使用者 ID（使用 username 作為 ID）
        setUserId(username);
      } else {
        // 清除使用者 ID
        setUserId(null);
      }
    }
  }, []);

  // 監聽 localStorage 變化（跨標籤頁同步）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'username') {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username');
        
        if (isLoggedIn && username) {
          setUserId(username);
        } else {
          setUserId(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 定期檢查（處理同標籤頁的變化）
    const interval = setInterval(() => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');
      
      if (isLoggedIn && username) {
        setUserId(username);
      } else {
        setUserId(null);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return null;
}

