import React from 'react';
import { Drawer, Stack, MenuItem, Divider, ListItemIcon, Link } from '@mui/material';
import { Home, Person, School, PostAdd, Login, PersonAdd, Help, LinkedIn } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  access: string | null;
  handleClose: () => void;
  is_teacher?: boolean;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({
  drawerOpen,
  setDrawerOpen,
  access,
  handleClose,
  is_teacher
}) => {

  return <Drawer
    anchor="left"
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    variant="temporary"
  >
    <Stack direction='column' spacing={2} mt={2}>
      <Link component={RouterLink} to='/' underline='none' color='inherit'>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
      </Link>
      <Link component={RouterLink} to='/teachers' underline='none' color='inherit'>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Teachers
        </MenuItem>
      </Link>
      <Link component={RouterLink} to='/students' underline='none' color='inherit'>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <School fontSize="small" />
          </ListItemIcon>
          Students
        </MenuItem>
      </Link>
      {
        is_teacher &&
        <Link component={RouterLink} to='/create-quiz' underline='none'>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PostAdd fontSize="small" />
            </ListItemIcon>
            Create Quiz
          </MenuItem>
        </Link>
      }

      <Divider />
      {
        !access
        && <>
          <Link component={RouterLink} to='/login' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          </Link>

          <Link component={RouterLink} to='/register' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Register
            </MenuItem>
          </Link>
        </>
      }

      <Link component={RouterLink} to='/faq' underline='none' color='inherit'>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          F.A.Q.
        </MenuItem>
      </Link>

      <Link
        href='https://www.linkedin.com/in/mustafaleventfidanci/'
        underline="none" color="inherit" target="_blank"
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LinkedIn fontSize="small" />
          </ListItemIcon>
          Visit me on LinkedIn
        </MenuItem>
      </Link>
    </Stack>
  </Drawer>;
};
