import React, { useContext, useState } from 'react';
import { Box, Typography, Button, IconButton, AppBar, Toolbar, Badge, Drawer, List, ListItem, ListItemText, Divider, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { 
    AdminPanelSettingsRounded, 
    DirectionsBikeRounded 
} from '@mui/icons-material';
import Logo from '../Images/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../GlobalContext';
import CartDrawer from './Cart/Cart';

export default function Nav() {
    const { token, setToken, handleDrawerOpen, carts, user } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    
  let navigate=useNavigate()
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
    setToken(false);
    localStorage.removeItem("userToken")
    
  };


    const drawerList = (
        <Box
            sx={{ width: 250, }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            
        >
<Box sx={{pl:1.5,my:2}}>
<img src={Logo} alt="Logo" style={{ height: '50px', marginRight: '1.2rem' }} />
                    <Typography variant="h6" sx={{ flexGrow: 0, marginRight: '5rem' }}>
                        DiningDynamics
                    </Typography>
</Box>

            <List>
                <ListItem button component={Link} to="/">
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/menus">
                    <ListItemText primary="Menu" />
                </ListItem>
                <ListItem button component={Link} to="/orders">
                    <ListItemText primary="Orders" />
                </ListItem>
                <ListItem button component={Link} to="/aboutus">
                    <ListItemText primary="About Us" />
                </ListItem>
            </List>
            <Divider />
            <List>
                {token ? (
                    <>
                        {user?.role === 'admin' && (
                            <ListItem button component={Link} to="/admin" sx={{ color: '#6366f1' }}>
                                <AdminPanelSettingsRounded sx={{ mr: 2 }} />
                                <ListItemText primary="Admin Panel" sx={{ '& span': { fontWeight: 800 } }} />
                            </ListItem>
                        )}
                        {user?.role === 'delivery' && (
                            <ListItem button component={Link} to="/delivery" sx={{ color: '#10b981' }}>
                                <DirectionsBikeRounded sx={{ mr: 2 }} />
                                <ListItemText primary="Courier Dashboard" sx={{ '& span': { fontWeight: 800 } }} />
                            </ListItem>
                        )}
                        <ListItem button onClick={handleLogout} sx={{ color: '#ef4444' }}>
                            <LogoutIcon sx={{ mr: 2 }} />
                            <ListItemText primary="Logout" sx={{ '& span': { fontWeight: 800 } }} />
                        </ListItem>
                    </>
                ) : (
                    <ListItem button component={Link} to="/login">
                        <AccountCircle sx={{ marginRight: '10px' }} />
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 9000,
                    p: 0.5,
                    borderBottomLeftRadius: '28px',
                    borderBottomRightRadius: '28px',
                    backgroundColor: 'white',
                    boxShadow: '0 0 1px #1f1f1f',
                    color: '#1f1f1f',
                }}
            >
                <Toolbar>
                    <img src={Logo} alt="Logo" style={{ height: '50px', marginRight: '1.2rem' }} />
                    <Typography variant="h6" sx={{ flexGrow: 0, marginRight: '5rem' }}>
                        DiningDynamics
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, gap: 3, marginLeft: '5rem' }}>
                        <Button component={Link} to="/" sx={{ fontWeight: 700, textTransform: 'none' }}>Home</Button>
                        <Button component={Link} to="/menus" sx={{ fontWeight: 700, textTransform: 'none' }}>Menu</Button>
                        <Button component={Link} to="/orders" sx={{ fontWeight: 700, textTransform: 'none' }}>Orders</Button>
                        <Button component={Link} to="/aboutus" sx={{ fontWeight: 700, textTransform: 'none' }}>About Us</Button>
                        
                        {/* Dynamic Management Link */}
                        {user?.role === 'admin' && (
                            <Button 
                                component={Link} 
                                to="/admin" 
                                variant="contained" 
                                size="small"
                                startIcon={<AdminPanelSettingsRounded />}
                                sx={{ borderRadius: '12px', bgcolor: '#6366f1', fontWeight: 700, textTransform: 'none' }}
                            >
                                Admin Panel
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, justifyContent: 'flex-end' }}>
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} sx={{zIndex:99999}}>
                        {drawerList}
                    </Drawer>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                        {token ? (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#6366f1', fontSize: '12px' }}>{user?.name?.charAt(0)}</Avatar>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>{user?.name}</Typography>
                                </Box>
                                <IconButton color="inherit" onClick={handleLogout} title="Logout">
                                    <LogoutIcon sx={{ color: '#ef4444' }} />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton color="inherit" component={Link} to="/login">
                                <Typography variant="h6" sx={{ fontSize: '15px', pr: '2px', fontWeight: 700 }}>Login</Typography>
                                <AccountCircle />
                            </IconButton>
                        )}
                        <IconButton color="inherit" onClick={handleDrawerOpen}>
                            <Badge badgeContent={carts == [] ? 0 : carts?.length} color="secondary">
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <CartDrawer />
        </>
    );
}
