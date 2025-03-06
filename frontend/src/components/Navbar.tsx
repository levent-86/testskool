import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Button, IconButton, useColorScheme,
  Box, Link, Stack, Tooltip,
  useMediaQuery, useTheme
} from '@mui/material';
import {
  DarkMode, LightMode,
  Menu as MenuIcon
} from '@mui/icons-material';
import { NavbarDrawer } from './navbar/NavbarDrawer';
import { PageMessages } from './PageMessages';
import { useAccessToken } from '../hooks/useAccessToken';
import { Link as RouterLink } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import UserMenu from './navbar/UserMenu';
import AuthButtons from './navbar/AuthButtons';


export const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const theme = useTheme();
  const { userData, message } = useUserData();
  const { access, setAccess } = useAccessToken();
  const { mode, setMode } = useColorScheme();

  // Media query for screen size (to check if it's medium or below)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  // useEffect for update access token
  useEffect(() => {
    setAccess(localStorage.getItem('access'));
  }, [setAccess, access]);



  return <>
    {
      // Alerting messages
      message &&
      <PageMessages message={message} severity='warning' />
    }
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'text.disabled',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
        height: '10vh',
      }}>

      {
        // Hamburger button for drawer
        isMobile && (
          <Tooltip title="Menu">
            <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )
      }
      {/* Drawer for mobile view */}
      <NavbarDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        access={access}
        handleClose={() => setDrawerOpen(false)}
        is_teacher={userData?.is_teacher}
      />

      {/* Logo */}
      <Link component={RouterLink} to='/' underline="none" variant="h4">TestSkool</Link>

      {/* Navs */}
      {
        !isMobile &&
        <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Link component={RouterLink} to="/" color="inherit" underline="none">Home</Link>
          <Link component={RouterLink} to="/teachers" color="inherit" underline="none">Teachers</Link>
          <Link component={RouterLink} to="/students" color="inherit" underline="none">Students</Link>
          {userData?.is_teacher &&
            <Button variant="outlined" component={RouterLink} to="/create-quiz">Create Quiz</Button>
          }
        </Stack>
      }

      <Stack direction='row' spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* User or Login */}
        {
          access ? (
            <UserMenu />
          ) : (
            (!isMobile && !userData) && <AuthButtons />
          )
        }

        {/* Dark / Light mode button */}
        <Tooltip title='Theme'>
          <IconButton sx={{
            border: '1px solid',
            borderColor: 'text.disabled',
            width: 32, height: 32
          }}
            onClick={
              () => setMode(mode === 'dark' ? 'light' : 'dark')
            }>
            {mode === 'light' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>


    <Outlet />
  </>;
};
