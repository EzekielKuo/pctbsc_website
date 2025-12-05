'use client';

import Link from 'next/link';
import { useState } from 'react';
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
import { useTheme } from '@mui/material/styles';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registrationAnchor, setRegistrationAnchor] = useState<null | HTMLElement>(null);
  const [prayerAnchor, setPrayerAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRegistrationClick = (event: React.MouseEvent<HTMLElement>) => {
    setRegistrationAnchor(event.currentTarget);
  };

  const handlePrayerClick = (event: React.MouseEvent<HTMLElement>) => {
    setPrayerAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setRegistrationAnchor(null);
    setPrayerAnchor(null);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
          大專聖經神學研究班
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem>
          <Link href="/" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="首頁" />
          </Link>
        </ListItem>
        <ListItem>
          <ListItemText primary="報名資訊" />
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/about" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="營會介紹" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/registration" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="報名資訊" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/faq" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="FAQ" />
          </Link>
        </ListItem>
        <ListItem>
          <ListItemText primary="代禱與推廣" />
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/prayer" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="代禱與支持" />
          </Link>
        </ListItem>
        <ListItem sx={{ pl: 4 }}>
          <Link href="/promotion" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="營會推廣" />
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/login" onClick={handleDrawerToggle} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
            <ListItemText primary="E-mail 登入" />
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
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
                大專聖經神學研究班
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                color={currentPage === 'home' ? 'primary' : 'inherit'}
                sx={{
                  bgcolor: currentPage === 'home' ? 'action.selected' : 'transparent',
                }}
              >
                首頁
              </Button>
            </Link>

            <Button
              onClick={handleRegistrationClick}
              endIcon={<ExpandMoreIcon />}
              color="inherit"
            >
              報名資訊
            </Button>
            <Menu
              anchorEl={registrationAnchor}
              open={Boolean(registrationAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/about" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  營會介紹
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/registration" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  報名資訊
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/faq" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  FAQ
                </Link>
              </MenuItem>
            </Menu>

            <Button
              onClick={handlePrayerClick}
              endIcon={<ExpandMoreIcon />}
              color="inherit"
            >
              代禱與推廣
            </Button>
            <Menu
              anchorEl={prayerAnchor}
              open={Boolean(prayerAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Link href="/prayer" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  代禱與支持
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link href="/promotion" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  營會推廣
                </Link>
              </MenuItem>
            </Menu>

            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button color="inherit">
                E-mail 登入
              </Button>
            </Link>
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
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
