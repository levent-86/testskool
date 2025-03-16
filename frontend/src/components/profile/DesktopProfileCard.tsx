import React, { useState } from 'react';
import { Avatar, Button, Paper, Stack, Typography } from '@mui/material';
import { useUserData } from '../../hooks/useUserData';
import { BaseURLS } from '../../constants/base-urls';
import { title } from '../../utils/title';
import { formatDate } from '../../utils/formatDate';
import { EditDialog } from './EditDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';


interface Subject {
  name: string;
  id: number;
}

interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  about?: string;
  profile_picture?: string;
  is_teacher?: boolean;
  is_student: boolean;
  subject?: Subject[];
  date_joined?: string;
}


const DesktopProfileCard: React.FC = () => {
  const { userData } = useUserData() as { userData: User };
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openPassword, setOpenPassword] = useState<boolean>(false);

  // Edit modal open/close
  const handleEditClickOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  // Password modal open/close
  const handlePasswordClickOpen = () => {
    setOpenPassword(true);
  };

  const handlePasswordClose = () => {
    setOpenPassword(false);
  };



  return <>
    {/* Edit Dialog */}
    <EditDialog
      handleClose={handleEditClose}
      open={openEdit}
    />

    {/* Password Dialog */}
    <ChangePasswordDialog
      handleClose={handlePasswordClose}
      open={openPassword}
    />

    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '350px',
        p: '1rem',
        m: '1rem'
      }}>
      <Avatar
        src={userData?.profile_picture ? (BaseURLS.MEDIA + userData.profile_picture) : ''}
        sx={{ width: '80px', height: '80px' }}
      />
      <Typography mt={2}>{userData?.username}</Typography>

      {/* Dialog buttons */}
      <Button variant='outlined' sx={{ width: '16em', mt: '1rem', mb: '1rem' }} onClick={handleEditClickOpen}>Edit Profile</Button>
      <Button variant='outlined' sx={{ width: '16em' }} onClick={handlePasswordClickOpen}>Change Password</Button>

      <Stack width='100%' mt={2} spacing={2}>
        <Typography>First Name: {title(userData?.first_name ? userData.first_name : '-')}</Typography>
        <Typography>Last Name: {title(userData?.last_name ? userData?.last_name : '-')}</Typography>
        <Typography>About: {userData?.about ? userData?.about : '-'}</Typography>
        {
          userData?.is_teacher &&
          <Stack>
            <Typography>Subject(s):</Typography>
            {
              userData.subject?.map((s, i) => (
                <Typography key={i}>- {title(s.name)}</Typography>
              ))
            }
          </Stack>
        }

        <Stack direction='row'>
          <Typography variant="body2" color="text.disabled" mr={.3}>Date you joined:</Typography>
          <Typography variant="body2" color="text.disabled">{formatDate(userData?.date_joined)}</Typography>
        </Stack>
      </Stack>
    </Paper>
  </>;
};

export default DesktopProfileCard;
