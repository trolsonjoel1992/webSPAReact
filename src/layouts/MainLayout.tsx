import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  SvgIcon,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  DarkMode,
  LightMode,
  Add,
  List,
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '@/shared/hooks/useAuthStore';
import { useColorScheme } from '@mui/material/styles';
import Logo from '@/assets/logo_header_1.svg?react';

export default function MainLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mode, setMode } = useColorScheme();
  const theme = useTheme();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
    handleProfileMenuClose();
  };

  // const handleProfile = () => {
  //   handleProfileMenuClose();
  //   navigate('/profile');
  // };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    // navigate('/auth');
  };

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleSellClick = () => {
    handleProfileMenuClose();
    navigate('/sell');
  };

  const handleMyPublications = () => {
    handleProfileMenuClose();
    navigate('/my-publications');
  };

  return (
    <>
      <AppBar position='static' elevation={1}>
        <Container maxWidth='xl'>
          <Toolbar disableGutters sx={{ minHeight: '70px' }}>
            {/* Logo */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <SvgIcon
                component={Logo}
                inheritViewBox
                sx={{
                  width: 160,
                  height: 60,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            {/* Botones de autenticación o menú de perfil */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  {/* Botón Vender */}
                  {/* <Button
                    variant='contained'
                    color='secondary'
                    startIcon={<Add />}
                    onClick={handleSellClick}
                    sx={{
                      mr: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Vender
                  </Button> */}

                  {/* Menú de perfil para usuarios autenticados */}
                  <IconButton
                    size='large'
                    edge='end'
                    aria-label='cuenta del usuario'
                    aria-controls='profile-menu'
                    aria-haspopup='true'
                    onClick={handleProfileMenuOpen}
                    sx={{
                      ml: 2,
                      // border: 1,
                      // borderColor: 'rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.6)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                    >
                      {user.username?.charAt(0).toUpperCase() || (
                        <AccountCircle />
                      )}
                    </Avatar>
                  </IconButton>

                  {/* Menú desplegable */}
                  <Menu
                    id='profile-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    sx={{
                      mt: 1,
                      '& .MuiPaper-root': {
                        borderRadius: 2,
                        minWidth: 200,
                        boxShadow: theme.shadows[8],
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* Información del usuario */}
                    {/* <MenuItem onClick={handleProfile}>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'primary.main',
                          }}
                        >
                          {user.username?.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={user.username || 'Usuario'}
                        // secondary={user.rol || 'CUSTOMER'}
                      />
                    </MenuItem> */}

                    {/* <Divider /> */}

                    {/* Toggle de tema */}
                    <MenuItem onClick={handleSellClick}>
                      <ListItemIcon>
                        <Add />
                      </ListItemIcon>
                      <ListItemText primary='Vender' />
                    </MenuItem>

                    {/* Mis publicaciones */}
                    <MenuItem onClick={handleMyPublications}>
                      <ListItemIcon>
                        <List />
                      </ListItemIcon>
                      <ListItemText primary='Mis publicaciones' />
                    </MenuItem>

                    {/* <Divider /> */}

                    {/* Toggle de tema */}
                    <MenuItem onClick={handleThemeToggle}>
                      <ListItemIcon>
                        {mode === 'dark' ? <LightMode /> : <DarkMode />}
                      </ListItemIcon>
                      <ListItemText
                        primary={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                      />
                    </MenuItem>

                    <Divider />

                    {/* Cerrar sesión */}
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon>
                        <Logout color='error' />
                      </ListItemIcon>
                      <ListItemText primary='Cerrar sesión' />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* Botones para usuarios no autenticados */}
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={handleLoginClick}
                    sx={{
                      my: 2,
                      mx: 1,
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleLoginClick}
                    sx={{
                      my: 2,
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Outlet />
    </>
  );
}
