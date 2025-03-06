import { useState } from 'react';
import {
  IconButton, Tooltip, Avatar, Menu,
  MenuItem, ListItemIcon, Divider, Link,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Settings, Help, Logout, LinkedIn } from '@mui/icons-material';
import { useAccessToken } from '../../hooks/useAccessToken';
import { useUserData } from '../../hooks/useUserData';
import { title } from '../../utils/title';
import { BaseURLS } from '../../constants/base-urls';


const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { userData } = useUserData();
  const { setAccess } = useAccessToken();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Tooltip title="Your Account">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={userData?.profile_picture ? (BaseURLS.MEDIA + userData.profile_picture) : ''}
          />
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
        <MenuItem onClick={handleClose} disabled>
          <Typography variant='subtitle2'>{title(userData?.first_name) || userData?.username}</Typography>
        </MenuItem>
        <Divider />

        <Link component={RouterLink} to='/my-profile' color="inherit" underline="none">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
        </Link>

        <Link component={RouterLink} to='/faq' color="inherit" underline="none">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Help fontSize="small" />
            </ListItemIcon>
            F.A.Q.
          </MenuItem>
        </Link>

        <Link
          href='https://www.linkedin.com/in/mustafaleventfidanci/'
          underline="none" color="inherit" target="_blank" rel='noopener'
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LinkedIn fontSize="small" />
            </ListItemIcon>
            Visit me on LinkedIn
          </MenuItem>
        </Link>

        <Divider />
        <MenuItem onClick={
          () => {
            handleClose();
            setAccess(null);
          }
        }>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
