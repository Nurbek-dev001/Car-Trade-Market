import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  DirectionsCar,
  Person,
  ShoppingCart,
  Favorite,
  Dashboard,
  Logout,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout, favoriteCount } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const navItems = [
    { text: 'Главная', path: '/' },
    { text: 'Каталог', path: '/cars' },
    { text: 'О компании', path: '/about' },
    { text: 'Контакты', path: '/contact' },
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <DirectionsCar sx={{ mr: 2 }} />
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Future Car
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <IconButton color="inherit" component={Link} to="/favorites">
                  <Badge badgeContent={favoriteCount} color="secondary">
                    <Favorite />
                  </Badge>
                </IconButton>
                
                <Button
                  color="inherit"
                  startIcon={<Person />}
                  onClick={handleMenu}
                >
                  {user.fullName}
                </Button>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleClose}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    <ListItemText>Профиль</ListItemText>
                  </MenuItem>
                  
                  <MenuItem component={Link} to="/orders" onClick={handleClose}>
                    <ListItemIcon><ShoppingCart fontSize="small" /></ListItemIcon>
                    <ListItemText>Мои заказы</ListItemText>
                  </MenuItem>
                  
                  {user.role === 'admin' && (
                    <MenuItem component={Link} to="/admin" onClick={handleClose}>
                      <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                      <ListItemText>Админ панель</ListItemText>
                    </MenuItem>
                  )}
                  
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    <ListItemText>Выйти</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  component={Link}
                  to="/login"
                >
                  Войти
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonAdd />}
                  component={Link}
                  to="/register"
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                button
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          
          <Divider />
          
          {user ? (
            <List>
              <ListItem button component={Link} to="/profile" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Профиль" />
              </ListItem>
              
              <ListItem button component={Link} to="/orders" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon><ShoppingCart /></ListItemIcon>
                <ListItemText primary="Мои заказы" />
              </ListItem>
              
              <ListItem button component={Link} to="/favorites" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <Badge badgeContent={favoriteCount} color="secondary">
                    <Favorite />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Избранное" />
              </ListItem>
              
              {user.role === 'admin' && (
                <ListItem button component={Link} to="/admin" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon><Dashboard /></ListItemIcon>
                  <ListItemText primary="Админ панель" />
                </ListItem>
              )}
              
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Выйти" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem button component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon><Login /></ListItemIcon>
                <ListItemText primary="Войти" />
              </ListItem>
              
              <ListItem button component={Link} to="/register" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon><PersonAdd /></ListItemIcon>
                <ListItemText primary="Регистрация" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};


export default Navbar;
