import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import DirectionsBikeRoundedIcon from '@mui/icons-material/DirectionsBikeRounded';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Tooltip, Avatar } from '@mui/material';

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#0f172a',
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(10)} + 1px)`,
  },
  backgroundColor: '#0f172a',
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Navigation() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentRoute = location.pathname;
    const items = {
      'Category': '/admin/category',
      'Menus': '/admin/menus',
      'Order': '/admin/order',
      'Request': '/admin/request',
      'User': '/admin/users',
      'Delivery': '/admin/delivery',
      'Dashboard': '/admin/'
    };
    
    const active = Object.keys(items).find(key => 
      key === 'Dashboard' ? currentRoute === items[key] : currentRoute.includes(items[key])
    ) || 'Dashboard';
    
    setActiveItem(active);
  }, [location.pathname]);

  const sideBarList = [
    { title: 'Dashboard', path: '/admin/', icon: <DashboardRoundedIcon /> },
    { title: 'Category', path: '/admin/category', icon: <CategoryRoundedIcon /> },
    { title: 'Menus', path: '/admin/menus', icon: <MenuBookRoundedIcon /> },
    { title: 'Order', path: '/admin/order', icon: <ReceiptRoundedIcon /> },
    { title: 'Request', path: '/admin/request', icon: <NotificationsRoundedIcon /> },
    { title: 'User', path: '/admin/users', icon: <GroupRoundedIcon /> },
    { title: 'Delivery', path: '/admin/delivery', icon: <DirectionsBikeRoundedIcon sx={{ fontSize: '20px' }} /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{
              marginRight: 5,
              color: '#64748b',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Logout">
              <IconButton 
                onClick={handleLogout}
                sx={{ 
                  color: '#64748b',
                  '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)', color: '#6366f1' } 
                }}
              >
                <LogoutRoundedIcon /> 
              </IconButton>
            </Tooltip>
            <Avatar 
                sx={{ 
                    bgcolor: '#6366f1', 
                    width: 35, 
                    height: 35,
                    fontSize: '14px',
                    fontWeight: 700
                }}
            >
                AD
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', py: 2 }}>
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#6366f1', 
                  borderRadius: '12px',
                  width: 40,
                  height: 40
                }}
              >
                <RestaurantMenuRoundedIcon sx={{ fontSize: '24px', color: 'white' }} />
              </Avatar>
              {open && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800, 
                    letterSpacing: '-0.5px', 
                    color: 'white' 
                  }}
                >
                  DiningDynamics
                </Typography>
              )}
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>

          <Box sx={{ px: 2, mt: 4 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                px: 2, 
                fontWeight: 700, 
                color: 'rgba(255, 255, 255, 0.4)', 
                display: open ? 'block' : 'none' 
              }}
            >
              Management
            </Typography>
            <List sx={{ mt: 1 }}>
              {sideBarList.map((item) => {
                const isActive = activeItem === item.title;
                return (
                  <ListItem key={item.title} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                    <Link to={item.path} style={{ textDecoration: 'none' }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          borderRadius: '12px',
                          justifyContent: open ? 'initial' : 'center',
                          px: 2.5,
                          backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                          color: isActive ? '#818cf8' : '#94a3b8',
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'white',
                          },
                          // Indicator for active item
                          ...(isActive && {
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: '20%',
                              height: '60%',
                              width: '4px',
                              backgroundColor: '#6366f1',
                              borderRadius: '0 4px 4px 0'
                            }
                          })
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 'auto',
                            justifyContent: 'center',
                            color: 'inherit',
                            fontSize: '22px'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            opacity: open ? 1 : 0,
                            '& .MuiTypography-root': {
                              fontSize: '14px',
                              fontWeight: isActive ? 700 : 500,
                            }
                          }}
                        />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box sx={{ mt: 'auto', px: 3, pb: 2, display: open ? 'block' : 'none' }}>
            <Box 
              sx={{ 
                p: 2, 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                Logged in as
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
