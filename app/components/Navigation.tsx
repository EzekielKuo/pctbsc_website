'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { event } from '@/lib/gtag';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutAnchor, setAboutAnchor] = useState<null | HTMLElement>(null);
  const [relatedSitesAnchor, setRelatedSitesAnchor] = useState<null | HTMLElement>(null);
  const [camp63Anchor, setCamp63Anchor] = useState<null | HTMLElement>(null);
  const [infoAnchor, setInfoAnchor] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLabel, setUserLabel] = useState('');
  const [textColor, setTextColor] = useState<'white' | 'black'>('white');

  // 共用的選單項 hover 色
  const hoverStyle = {
    transition: 'color 0.2s ease',
    '&:hover': { color: '#1976d2' },
  };

  // 使用 Ref 管理計時器，防止懸停間隙導致消失
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 強制關閉所有選單狀態
  const closeAllMenusImmediately = useCallback(() => {
    clearTimer();
    setAboutAnchor(null);
    setRelatedSitesAnchor(null);
    setCamp63Anchor(null);
    setInfoAnchor(null);
  }, [clearTimer]);

  // 延遲關閉選單，提供 150ms 緩衝跨越間隙
  const handleDelayedClose = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      setAboutAnchor(null);
      setRelatedSitesAnchor(null);
      setCamp63Anchor(null);
      setInfoAnchor(null);
    }, 150);
  }, [clearTimer]);

  // 開啟選單（先清除所有其他選單）
  const handleMenuOpen = (setter: (el: HTMLElement | null) => void) => (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    closeAllMenusImmediately(); 
    setter(target);
  };

  const handleLogout = useCallback(() => {
    event({ action: 'click', category: 'button', label: '登出' });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserLabel('');
    closeAllMenusImmediately();
    
    router.push('/login');
    router.refresh();
  }, [router, closeAllMenusImmediately]);

  // 滾動監測與文字顏色處理
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const appBar = document.querySelector('[role="banner"]') as HTMLElement;
      if (!appBar) return;
      const appBarRect = appBar.getBoundingClientRect();
      const checkElement = document.elementFromPoint(window.innerWidth / 2, appBarRect.bottom + 50);
      if (checkElement) {
        const computedStyle = window.getComputedStyle(checkElement);
        const rgb = computedStyle.backgroundColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const isLight = parseInt(rgb[0]) > 200 && parseInt(rgb[1]) > 200 && parseInt(rgb[2]) > 200;
          setTextColor(isLight ? 'black' : 'white');
        }
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 登入狀態監測
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window === 'undefined') return;
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const loginTime = localStorage.getItem('loginTime');
      if (loggedIn && loginTime && Date.now() - parseInt(loginTime) >= 3600000) {
        handleLogout();
        return;
      }
      setIsLoggedIn(loggedIn);
      setIsAdmin(loggedIn && localStorage.getItem('isAdmin') === 'true');
      setUserLabel(localStorage.getItem('username') || '');
    };
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 60000);
    const handleStorageChange = (e: StorageEvent) => {
      // 當 key 為 null 時（手動 dispatch 的事件），也檢查登入狀態
      if (!e.key || e.key === 'isLoggedIn' || e.key === 'loginTime' || e.key === 'isAdmin' || e.key === 'username') {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleLogout]);

  const trackNavigationClick = useCallback((label: string, type: 'internal' | 'external' = 'internal') => {
    event({ action: 'click', category: type === 'internal' ? 'navigation' : 'external_link', label: label });
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 選單共用設定：解決間隙問題
  const commonMenuProps = {
    paper: {
      onMouseEnter: clearTimer,
      onMouseLeave: handleDelayedClose,
      sx: { 
        mt: 0, 
        pt: 0,
        bgcolor: 'rgba(0, 0, 0, 0.4)', 
        backdropFilter: 'blur(10px)', 
        color: 'white', 
        pointerEvents: 'auto' 
      }
    } as any
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>63rd神研班</Typography>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem><ListItemText primary="關於神研班" /></ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/about" onClick={() => { trackNavigationClick('神研班介紹'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="神研班介紹" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/about/timeline" onClick={() => { trackNavigationClick('重要時程'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="重要時程" />
          </Link>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem><ListItemText primary="神研前輩訪談" /></ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview" onClick={() => { trackNavigationClick('緣起'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="緣起" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/chen-nan-zhou" onClick={() => { trackNavigationClick('第1-7屆｜陳南州牧師'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第1-7屆｜陳南州牧師" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/huang-chun-sheng" onClick={() => { trackNavigationClick('第20屆後｜黃春生牧師'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第20屆後｜黃春生牧師" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/huang-hsu-hui" onClick={() => { trackNavigationClick('第50屆後｜黃敘慧姊妹'); handleDrawerToggle(); }} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第50屆後｜黃敘慧姊妹" />
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', color: textColor, backdropFilter: 'blur(10px)', width: '100%' }}>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <Box sx={{ flexGrow: 1, '@media (min-width: 800px)': { flexGrow: 0, marginRight: 4 } }}>
            <Link href="/" onClick={() => trackNavigationClick('首頁 Logo')} style={{ textDecoration: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>63rd神研班</Typography>
            </Link>
          </Box>

          <Box sx={{ display: 'none', '@media (min-width: 800px)': { display: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            
            {/* 關於神研班選單 */}
            <Box onMouseLeave={handleDelayedClose}>
              <Button
                onMouseEnter={handleMenuOpen(setAboutAnchor)}
                sx={{ textTransform: 'none', color: textColor, fontSize: '1rem', px: 1.5, py: 1, transition: 'color 0.2s ease', '&:hover': { color: '#1976d2' } }}
              >
                關於神研班
              </Button>
              <Menu
                anchorEl={aboutAnchor}
                open={Boolean(aboutAnchor)}
                onClose={closeAllMenusImmediately}
                disableRestoreFocus
                sx={{ pointerEvents: 'none' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={commonMenuProps}
              >
                <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                  <Link href="/about" onClick={() => trackNavigationClick('神研班介紹')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>神研班介紹</Link>
                </MenuItem>
                <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                  <Link href="/about/timeline" onClick={() => trackNavigationClick('重要時程')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>重要時程</Link>
                </MenuItem>
              </Menu>
            </Box>

            {/* 神研前輩訪談選單 */}
            <Box onMouseLeave={handleDelayedClose}>
              <Button
                onMouseEnter={handleMenuOpen(setRelatedSitesAnchor)}
                sx={{ textTransform: 'none', color: textColor, fontSize: '1rem', px: 1.5, py: 1, transition: 'color 0.2s ease', '&:hover': { color: '#1976d2' } }}
              >
                神研前輩訪談
              </Button>
              <Menu
                anchorEl={relatedSitesAnchor}
                open={Boolean(relatedSitesAnchor)}
                onClose={closeAllMenusImmediately}
                disableRestoreFocus
                sx={{ pointerEvents: 'none' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={commonMenuProps}
              >
               <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                <Link href="/interview" onClick={() => trackNavigationClick('緣起')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>緣起</Link>
              </MenuItem>
               <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                <Link href="/interview/chen-nan-zhou" onClick={() => trackNavigationClick('第1-7屆｜陳南州牧師')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>第1-7屆｜陳南州牧師</Link>
              </MenuItem>
               <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                <Link href="/interview/huang-chun-sheng" onClick={() => trackNavigationClick('第20屆後｜黃春生牧師')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>第20屆後｜黃春生牧師</Link>
              </MenuItem>
               <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                <Link href="/interview/huang-hsu-hui" onClick={() => trackNavigationClick('第50屆後｜黃敘慧姊妹')} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>第50屆後｜黃敘慧姊妹</Link>
              </MenuItem>
            </Menu>
            </Box>

            {/* 63神研選單 */}
            <Box onMouseLeave={handleDelayedClose}>
              <Button 
                onMouseEnter={handleMenuOpen(setCamp63Anchor)}
                sx={{ textTransform: 'none', color: textColor, fontSize: '1rem', px: 1.5, py: 1, transition: 'color 0.2s ease', '&:hover': { color: '#1976d2' } }}
              >
                63神研
              </Button>
              <Menu
                anchorEl={camp63Anchor}
                open={Boolean(camp63Anchor)}
                onClose={closeAllMenusImmediately}
                disableRestoreFocus
                sx={{ pointerEvents: 'none' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={commonMenuProps}
              >
                 <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                  <Link href="/bsc/theme" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>神研班主題</Link>
                </MenuItem>
                 <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                  <Link href="/bsc/info" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>活動資訊</Link>
                </MenuItem>
                 <MenuItem onClick={closeAllMenusImmediately} sx={hoverStyle}>
                  <Link href="/bsc/schedule" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>活動日程表</Link>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Facebook 和 Instagram Icon */}
            <IconButton
              component="a"
              href="https://www.facebook.com/PCTBSC/?locale=zh_TW"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => event({
                action: 'click',
                category: 'external_link',
                label: 'Facebook',
              })}
              size="small"
              sx={{
                width: 40,
                height: 40,
                border: '2px solid',
                borderColor: 'white',
                borderRadius: '50%',
                color: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.instagram.com/pctbsc63/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => event({
                action: 'click',
                category: 'external_link',
                label: 'Instagram',
              })}
              size="small"
              sx={{
                width: 40,
                height: 40,
                border: '2px solid',
                borderColor: 'white',
                borderRadius: '50%',
                color: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                },
              }}
            >
              <InstagramIcon fontSize="small" />
            </IconButton>

            {isLoggedIn && (
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {userLabel || (isAdmin ? 'admin' : 'user')}
              </Typography>
            )}

            {isLoggedIn ? (
              <Box onMouseLeave={handleDelayedClose}>
                <IconButton 
                  onMouseEnter={handleMenuOpen(setInfoAnchor)}
                  sx={{ color: textColor }}
                >
                  <MenuOpenIcon />
                </IconButton>
                <Menu
                  anchorEl={infoAnchor}
                  open={Boolean(infoAnchor)}
                  onClose={closeAllMenusImmediately}
                  disableRestoreFocus
                  sx={{ pointerEvents: 'none' }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={commonMenuProps}
                >
                  <MenuItem onClick={() => { closeAllMenusImmediately(); router.push('/edit'); }} sx={hoverStyle}>網頁設定</MenuItem>
                  <MenuItem onClick={() => { closeAllMenusImmediately(); router.push('/reply'); }} sx={hoverStyle}>留言反饋</MenuItem>
                  <Divider sx={{ bgcolor: textColor === 'white' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={hoverStyle}>登出</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                component={Link} 
                href="/login" 
                onClick={() => trackNavigationClick('登入')}
                variant="outlined" 
                sx={{ 
                  textTransform: 'none', 
                  color: '#1976d2',
                  borderColor: '#1976d2',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: '#1565c0', 
                    borderColor: '#1565c0', 
                    backgroundColor: 'rgba(21, 101, 192, 0.08)' 
                  } 
                }}
              >
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={mobileOpen} onClose={handleDrawerToggle}>{drawer}</Drawer>
    </>
  );
}