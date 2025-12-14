'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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
import { useTheme } from '@mui/material/styles';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registrationAnchor, setRegistrationAnchor] = useState<null | HTMLElement>(null);
  const [aboutAnchor, setAboutAnchor] = useState<null | HTMLElement>(null);
  const [relatedSitesAnchor, setRelatedSitesAnchor] = useState<null | HTMLElement>(null);
  const [infoAnchor, setInfoAnchor] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [textColor, setTextColor] = useState<'white' | 'black'>('white');
  const theme = useTheme();

  // 監聽滾動，檢測導覽列下方是否有白色背景
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const appBar = document.querySelector('[role="banner"]') as HTMLElement;
      if (!appBar) return;

      const appBarRect = appBar.getBoundingClientRect();
      const scrollY = window.scrollY;
      const appBarBottom = appBarRect.bottom + scrollY;
      
      // 檢查導覽列下方 50px 處的背景色
      const checkElement = document.elementFromPoint(
        window.innerWidth / 2,
        appBarRect.bottom + 50
      );
      
      if (checkElement) {
        const computedStyle = window.getComputedStyle(checkElement);
        const bgColor = computedStyle.backgroundColor;
        
        // 簡單檢測是否為白色或淺色背景
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const r = parseInt(rgb[0]);
          const g = parseInt(rgb[1]);
          const b = parseInt(rgb[2]);
          // 如果 RGB 值都大於 200，視為白色背景
          const isLight = r > 200 && g > 200 && b > 200;
          setTextColor(isLight ? 'black' : 'white');
        }
      }
    };

    // 初始檢查
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setInfoAnchor(null);
    router.push('/');
    router.refresh();
  }, [router]);

  // 檢查登入狀態和自動登出
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window === 'undefined') return;

      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const loginTime = localStorage.getItem('loginTime');

      if (loggedIn && loginTime) {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 一小時（毫秒）
        const timeSinceLogin = now - parseInt(loginTime);

        // 如果超過一小時，自動登出
        if (timeSinceLogin >= oneHour) {
          handleLogout();
          return;
        }
      }

      setIsLoggedIn(loggedIn);
    };

    // 初始檢查
    checkLoginStatus();

    // 每分鐘檢查一次
    const interval = setInterval(checkLoginStatus, 60000);

    // 監聽 storage 變化（跨標籤頁同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'loginTime') {
        checkLoginStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleLogout]);

  useEffect(() => {
    const syncAdminStatus = () => {
      if (typeof window === 'undefined') return;
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };

    syncAdminStatus();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isAdmin') {
        syncAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRegistrationClick = (event: React.MouseEvent<HTMLElement>) => {
    setRegistrationAnchor(event.currentTarget);
  };

  const handleRegistrationMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setRegistrationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setRegistrationAnchor(null);
    setAboutAnchor(null);
    setRelatedSitesAnchor(null);
    setInfoAnchor(null);
  };

  const handleAboutMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAboutAnchor(event.currentTarget);
  };

  const handleRelatedSitesMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setRelatedSitesAnchor(event.currentTarget);
  };

  const handleInfoClick = (event: React.MouseEvent<HTMLElement>) => {
    setInfoAnchor(event.currentTarget);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
          63rd神研班
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="關於神研班" />
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/about" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="營隊介紹" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/about/timeline" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="重要時程" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T" onClick={handleDrawerToggle} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="報名資訊" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/faq" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="FAQ" />
          </Link>
        </ListItem>
        <ListItem>
          <ListItemText primary="神研前輩訪談" />
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="緣起" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/chen-nan-zhou" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第1-7屆｜陳南州牧師" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/huang-chun-sheng" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第20屆後｜黃春生牧師" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/interview/huang-hsu-hui" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="第50屆後｜黃敍慧姊妹" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T" onClick={handleDrawerToggle} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="報名資訊" />
          </Link>
        </ListItem>
        {isLoggedIn ? (
          <>
            <Divider />
            <ListItem>
              <ListItemText primary="資訊" secondary="已登入" />
            </ListItem>
            <ListItem
              component="a"
              href="https://drive.google.com/drive/u/0/folders/1Ah9bEKb-7GkzvWoMnGbxp0ijOi1-6_YO"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDrawerToggle}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="63神研班雲端" />
            </ListItem>
            <ListItem
              component="a"
              href="https://drive.google.com/drive/folders/1eg74jSgVXo0ilXmmrYEEs7pc3c_nWEoH"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDrawerToggle}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="62神研班雲端" />
            </ListItem>
            <ListItem
              component="a"
              href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDrawerToggle}
              sx={{ pl: 4 }}
            >
              <ListItemText primary="活動報名網站" />
            </ListItem>
            <Divider />
            <ListItem
              component={Link}
              href="/edit"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="編輯" />
            </ListItem>
            <Divider />
            <ListItem onClick={handleDrawerToggle}>
              <ListItemText primary="如何編輯" />
            </ListItem>
            <Divider />
            <ListItem onClick={() => { handleLogout(); handleDrawerToggle(); }}>
              <ListItemText primary="登出" />
            </ListItem>
          </>
        ) : (
          <ListItem>
            <Link href="/login" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemText primary="登入" />
            </Link>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.4)', 
          color: textColor,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <Box
            sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 4 },
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: 'none',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                }}
              >
                63rd神研班
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            <Box
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleClose}
              sx={{ position: 'relative' }}
            >
              <Button
                sx={{ textTransform: 'none', color: textColor, fontSize: '1rem' }}
              >
                關於神研班
              </Button>
              <Menu
                anchorEl={aboutAnchor}
                open={Boolean(aboutAnchor)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                    },
                  },
                }}
                MenuListProps={{
                  onMouseLeave: handleClose,
                }}
                sx={{
                  pointerEvents: 'none',
                  '& .MuiPaper-root': {
                    pointerEvents: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: textColor,
                  },
                }}
              >
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/about" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    營隊介紹
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/about/timeline" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    重要時程
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T" style={{ textDecoration: 'none', color: textColor, width: '100%' }} target="_blank" rel="noopener noreferrer">
                    報名資訊
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/faq" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    FAQ
                  </Link>
                </MenuItem>
              </Menu>
            </Box>

            <Box
              onMouseEnter={handleRelatedSitesMouseEnter}
              onMouseLeave={handleClose}
              sx={{ position: 'relative' }}
            >
              <Button
                sx={{ textTransform: 'none', color: textColor, fontSize: '1rem' }}
              >
                神研前輩訪談
              </Button>
              <Menu
                anchorEl={relatedSitesAnchor}
                open={Boolean(relatedSitesAnchor)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                    },
                  },
                }}
                MenuListProps={{
                  onMouseLeave: handleClose,
                }}
                sx={{
                  pointerEvents: 'none',
                  '& .MuiPaper-root': {
                    pointerEvents: 'auto',
                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: textColor,
                  },
                }}
              >
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/interview" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    緣起
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/interview/chen-nan-zhou" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    第1-7屆｜陳南州牧師
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/interview/huang-chun-sheng" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    第20屆後｜黃春生牧師
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                  <Link href="/interview/huang-hsu-hui" style={{ textDecoration: 'none', color: textColor, width: '100%' }}>
                    第50屆後｜黃敍慧姊妹
                  </Link>
                </MenuItem>
              </Menu>
            </Box>

            <Button
              component="a"
              href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none', color: textColor, fontSize: '1rem' }}
            >
              報名資訊
            </Button>

            {/* 社群媒體連結 */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto', mr: 2 }}>
              <IconButton
                component="a"
                href="https://www.facebook.com/PCTBSC/?locale=zh_TW"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: textColor,
                  borderRadius: '50%',
                  color: textColor,
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/pctbsc63/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: textColor,
                  borderRadius: '50%',
                  color: textColor,
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* 登入/資訊按鈕 - 移到最右側，固定位置 */}
            <Box 
              sx={{ minWidth: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, flexShrink: 0 }}
              onMouseEnter={isLoggedIn ? handleInfoClick : undefined}
              onMouseLeave={isLoggedIn ? handleClose : undefined}
            >
              {isAdmin ? (
                <Typography variant="caption" sx={{ fontWeight: 600, color: textColor }}>
                  admin
                </Typography>
              ) : isLoggedIn ? (
                <Typography variant="caption" sx={{ fontWeight: 600, color: textColor }}>
                  user
                </Typography>
              ) : null}
              {isLoggedIn ? (
                <>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      color: textColor,
                    }}
                  >
                    <MenuOpenIcon />
                  </IconButton>
                  <Menu
                    anchorEl={infoAnchor}
                    open={Boolean(infoAnchor)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1.5,
                        },
                      },
                    }}
                    MenuListProps={{
                      onMouseLeave: handleClose,
                    }}
                    sx={{
                      pointerEvents: 'none',
                      '& .MuiPaper-root': {
                        pointerEvents: 'auto',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        color: textColor,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/edit"
                      sx={{ color: textColor }}
                    >
                      網頁設定
                    </MenuItem>
                    <MenuItem onClick={handleClose} sx={{ color: textColor }}>
                      網頁設定指南
                    </MenuItem>
                    <Divider sx={{ bgcolor: textColor === 'white' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', my: 0.5 }} />
                    <MenuItem
                      onClick={handleClose}
                      component="a"
                      href="https://drive.google.com/drive/u/0/folders/1Ah9bEKb-7GkzvWoMnGbxp0ijOi1-6_YO"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: textColor }}
                    >
                      63神研班雲端
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component="a"
                      href="https://drive.google.com/drive/folders/1eg74jSgVXo0ilXmmrYEEs7pc3c_nWEoH"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: textColor }}
                    >
                      62神研班雲端
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component="a"
                      href="https://acts.pct.org.tw/djactive/ActDetails.aspx?ActID=2510121303INL05T"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: textColor }}
                    >
                      活動報名網站
                    </MenuItem>
                    <Divider sx={{ bgcolor: textColor === 'white' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', my: 0.5 }} />
                    <MenuItem onClick={handleLogout} sx={{ color: textColor }}>
                      登出
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      color: textColor,
                    }}
                  >
                    <MenuOpenIcon />
                  </IconButton>
                </Link>
              )}
            </Box>
          </Box>

          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: textColor }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
