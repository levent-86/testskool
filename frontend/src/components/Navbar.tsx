import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Button, IconButton, useColorScheme, Box, Link, Stack, Tooltip, Avatar, Menu, MenuItem, ListItemIcon, Divider, useMediaQuery, useTheme } from '@mui/material';
import { DarkMode, LightMode, PersonAdd, Settings, Help, Logout, Login, Menu as MenuIcon } from '@mui/icons-material';
import { NavbarDrawer } from './navbar/NavbarDrawer';


export const Navbar: React.FC = () => {
  const { mode, setMode } = useColorScheme();
  const [access, setAccess] = useState<string | null>(localStorage.getItem('access'));

  // Use MUI theme
  const theme = useTheme();

  // Media query for screen size (to check if it's medium or below)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Open / close User and Login/Register button sections
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  // useEffect for update access token status
  useEffect(() => {
    // Check the access token
    const updateAccessToken = () => {
      setAccess(localStorage.getItem('access'));
    };

    updateAccessToken();

    // Listen localStorage changes
    window.addEventListener('storage', updateAccessToken);

    // Remove the listener
    return () => window.removeEventListener('storage', updateAccessToken);
  }, []);


  return <>
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'text.disabled',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1
      }}>

      {
        // Hamburger button for drawer
        isMobile && (
          <Tooltip title="Menu">
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )
      }
      {/* Drawer for mobile view */}
      <NavbarDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} access={access} handleClose={handleClose} />

      {/* Logo */}
      <Link href='/' underline="none" variant="h4">TestSkool</Link>

      {/* Navs */}
      {
        !isMobile && (
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" color="inherit" underline="none">Home</Link>
            <Link href="/teachers" color="inherit" underline="none">Teachers</Link>
            <Link href="/students" color="inherit" underline="none">Students</Link>
            {access && <Button variant="outlined" href="/create-quiz">Create Quiz</Button>}
          </Stack>
        )
      }

      <Stack direction='row' spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* User or Login */}
        {
          access
            ?
            /* Show user if logged in */
            <>
              <Tooltip title="Your Account">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Link href='/my-profile' color="inherit" underline="none">
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                </Link>

                <Link href='/faq' color="inherit" underline="none">
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <Help fontSize="small" />
                    </ListItemIcon>
                    F.A.Q.
                  </MenuItem>
                </Link>

                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
            :
            !isMobile &&
            
            /* Show login/register button if not logged in */
            <>
              <Button
                onClick={handleClick}
                variant="outlined"
                color="inherit"
              >
                Login/Register
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <Stack direction='column' spacing={.5}>
                  <Link href='/login' underline='none' color='inherit'>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <Login fontSize="small" />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                  </Link>

                  <Link href='/register' underline='none' color='inherit'>
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      Register
                    </MenuItem>
                  </Link>

                  <Divider />

                  <Link href='/faq' underline="none" color="inherit">
                    <MenuItem onClick={handleClose}>
                      <ListItemIcon>
                        <Help fontSize="small" />
                      </ListItemIcon>
                      F.A.Q.
                    </MenuItem>
                  </Link>

                </Stack>
              </Menu>
            </>
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
