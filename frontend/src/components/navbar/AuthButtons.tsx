import { Help, LinkedIn, Login, PersonAdd } from '@mui/icons-material';
import { Button, Divider, Link, ListItemIcon, Menu, MenuItem, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';


const AuthButtons: React.FC = () => {

  // Open / close User and Login/Register button sections
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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

          <Divider />

          <Link component={RouterLink} to='/faq' underline="none" color="inherit">
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Help fontSize="small" />
              </ListItemIcon>
              F.A.Q.
            </MenuItem>
          </Link>

          <Link
            component={RouterLink} to='https://www.linkedin.com/in/mustafaleventfidanci/'
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
      </Menu>
    </>
  );
};

export default AuthButtons;
