'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Navigation from '../components/Navigation';
import { Lock, Mail, Github, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { event } from '@/lib/gtag';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const showLanding = !showAdvanced;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session?.user) {
          const hasCustomUserId = (session.user as any)?.customUserId;
          if (hasCustomUserId) {
            // 已設定 userId，更新 localStorage 並導回首頁
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', hasCustomUserId);
            localStorage.setItem('loginTime', Date.now().toString());
            localStorage.setItem('isAdmin', 'false');
            // 觸發 storage 事件讓 Navigation 立即更新
            window.dispatchEvent(new Event('storage'));
            setSuccess('已登入，即將導回首頁');
            setTimeout(() => {
              router.push('/');
              router.refresh();
            }, 500);
          } else {
            setSuccess('登入成功！請設定您的使用者 ID');
            setShowAdvanced(true);
          }
        }
      } catch (err) {
        console.warn('session check failed', err);
      }
    };
    checkAuth();
  }, [router]);

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError('');
    setSuccess('');
    setOauthLoading(provider);

    try {
      // OAuth 需要重定向到提供商的授權頁面
      await signIn(provider, {
        callbackUrl: '/login',
        redirect: true,
      });
      
      // 如果 redirect: true，這行代碼不會執行，因為會立即重定向
      // 但如果 redirect 失敗，我們會在這裡處理錯誤
    } catch (err) {
      console.error('OAuth 登入錯誤:', err);
      setError('登入時發生錯誤，請稍後再試');
      setOauthLoading(null);
      event({
        action: 'login',
        category: 'authentication',
        label: `oauth_${provider}_failure`,
      });
    }
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 帳號和密碼為非必填，允許空值提交
    const isAdmin = username === 'admin' && password === 'admin';
    const isGuest = (!username.trim() && !password.trim()) || (username.trim() === '' && password.trim() === '');
    
    if (isAdmin || isGuest) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', isAdmin ? 'admin' : (username.trim() || 'guest'));
      localStorage.setItem('loginTime', Date.now().toString());
      // 設置 admin 狀態
      if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.setItem('isAdmin', 'false');
      }
      // 觸發 storage 事件讓 Navigation 立即更新
      window.dispatchEvent(new Event('storage'));
      setSuccess('登入成功！');
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

      setSuccess('使用者 ID 設定成功！');
      // 確保導覽列顯示登入狀態（與原本 localStorage 檢查一致）
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', userId.trim());
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('isAdmin', 'false');
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
    <div className="min-h-screen bg-gray-900 flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
      <Navigation currentPage="login" />
      <main className="flex-1 flex items-center justify-center py-12 px-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
        <div className="w-full" style={{ maxWidth: '520px', padding: '0 24px' }}>
          <Card className="shadow-2xl bg-white border-0 rounded-lg" style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            {showLanding && (
              <CardHeader className="space-y-6 text-center pb-8 pt-8" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
                {/* 鎖圖標 */}
                <div className="flex justify-center" style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '24px' }}>
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock className="w-8 h-8 text-white" style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold text-gray-900" style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>登入</CardTitle>
                  <CardDescription className="text-sm text-gray-600" style={{ fontSize: '14px', color: '#4b5563' }}>
                    請使用帳號密碼登入，或使用 Google / GitHub 進行登入
                  </CardDescription>
                </div>
              </CardHeader>
            )}

            <CardContent className="space-y-6 px-8 pb-8">
              {/* 錯誤訊息 */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '14px', color: '#991b1b', marginBottom: '24px' }}>
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* 成功訊息 */}
              {success && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '14px', color: '#166534', marginBottom: '24px' }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{success}</span>
                </div>
              )}

              {showLanding && (
                <>
                  {/* 帳號密碼登入表單 */}
                  <form onSubmit={handleCredentialSubmit} className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User className="w-4 h-4 text-gray-500" style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        帳號
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="請輸入帳號"
                        className="bg-gray-100 border-gray-300 h-11"
                        style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', height: '44px', borderRadius: '6px', padding: '0 12px' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock className="w-4 h-4 text-gray-500" style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        密碼
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="請輸入密碼"
                        className="bg-gray-100 border-gray-300 h-11"
                        style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', height: '44px', borderRadius: '6px', padding: '0 12px' }}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={oauthLoading !== null}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium"
                      style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', height: '44px', fontWeight: '500', borderRadius: '6px', border: 'none', cursor: oauthLoading !== null ? 'not-allowed' : 'pointer' }}
                    >
                      登入
                    </Button>
                  </form>

                  {/* 分隔線 */}
                  <div className="relative flex py-5 items-center" style={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
                    <div className="grow border-t border-gray-300" style={{ flexGrow: 1, borderTop: '1px solid #d1d5db' }}></div>
                    <span className="shrink mx-4 text-gray-600 text-sm" style={{ flexShrink: 0, margin: '0 16px', color: '#4b5563', fontSize: '14px' }}>或</span>
                    <div className="grow border-t border-gray-300" style={{ flexGrow: 1, borderTop: '1px solid #d1d5db' }}></div>
                  </div>

                  {/* OAuth 按鈕 - 在登入按鈕下方 */}
                  <div className="space-y-3 flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-red-500 hover:bg-red-600 text-white border-red-500 h-11 font-medium"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={oauthLoading !== null}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: '1px solid #ef4444', height: '44px', fontWeight: '500', borderRadius: '6px', width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: oauthLoading !== null ? 'not-allowed' : 'pointer' }}
                    >
                      {oauthLoading === 'google' ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                            <path
                              fill="white"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="white"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="white"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="white"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Google</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-900 text-white border-gray-900 hover:bg-black h-11 font-medium"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={oauthLoading !== null}
                      style={{ backgroundColor: '#111827', color: 'white', border: '1px solid #111827', height: '44px', fontWeight: '500', borderRadius: '6px', width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', cursor: oauthLoading !== null ? 'not-allowed' : 'pointer' }}
                    >
                      {oauthLoading === 'github' ? (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <>
                          <Github className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
                          <span>GitHub</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* 進階選項（使用者 ID 設定）- 預設隱藏 */}
              {showAdvanced && (
                <>
                  {/* 使用者 ID 設定 */}
                  <div className="pt-6 border-t border-gray-200" style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <form onSubmit={handleUserIdSubmit} className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="space-y-2 flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Label 
                          htmlFor="userId" 
                          className="text-sm font-medium text-gray-700 flex items-center gap-2 w-full justify-center"
                          style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                        >
                          <Mail className="w-4 h-4 text-gray-500" style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          使用者 ID (最多 15 字元)
                        </Label>
                        <Input
                          id="userId"
                          type="text"
                          maxLength={15}
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          placeholder="請設定您的使用者 ID"
                          disabled={loading}
                          className="bg-gray-100 border-gray-300 h-11 text-center"
                          style={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', height: '44px', borderRadius: '6px', padding: '0 12px', textAlign: 'center', width: '100%', color: '#000000' }}
                        />
                        <p className="text-xs text-gray-500 text-center w-full" style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', width: '100%' }}>
                          已輸入 {userId.length} / 15 字元
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || oauthLoading !== null}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium"
                        style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', height: '44px', fontWeight: '500', borderRadius: '6px', border: 'none', cursor: loading || oauthLoading !== null ? 'not-allowed' : 'pointer', opacity: loading || oauthLoading !== null ? 0.5 : 1 }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" style={{ width: '16px', height: '16px', marginRight: '8px', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
                            設定中...
                          </>
                        ) : (
                          '設定使用者 ID'
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
