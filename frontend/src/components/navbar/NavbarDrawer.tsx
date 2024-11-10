import React from 'react';
import { Drawer, Stack, MenuItem, Divider, ListItemIcon, Link } from '@mui/material';
import { Home, Person, School, PostAdd, Login, PersonAdd, Help } from '@mui/icons-material';

interface NavbarDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  access: string | null;
  handleClose: () => void;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({ drawerOpen, setDrawerOpen, access, handleClose }) => (
  <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      variant="temporary"
    >
        <Stack direction='column' spacing={2}>
          <Link href='/' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Home fontSize="small" />
              </ListItemIcon>
              Home
            </MenuItem>
          </Link>
          <Link href='/teachers' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Teachers
            </MenuItem>
          </Link>
          <Link href='/students' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <School fontSize="small" />
              </ListItemIcon>
              Students
            </MenuItem>
          </Link>
          {
            access &&
            <Link href='/create-quiz' underline='none'>
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
            </>
          }

          <Link href='/faq' underline='none' color='inherit'>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Help fontSize="small" />
              </ListItemIcon>
              F.A.Q.
            </MenuItem>
          </Link>
        </Stack>
    </Drawer>
);
