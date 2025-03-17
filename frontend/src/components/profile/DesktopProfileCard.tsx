import React, { useState } from 'react';
import { Paper } from '@mui/material';
import { EditDialog } from './EditDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { ProfileContent } from './ProfileContent';


interface ProfileCardProps {
  page: 'my-profile' | 'profile';
}

const DesktopProfileCard: React.FC<ProfileCardProps> = ({ page }) => {
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
    {
      page === 'my-profile' &&
      <>
        {/* Edit Dialog */}
        <EditDialog
          handleClose={handleEditClose}
          open={openEdit}
        />

        {/*  Password Dialog  */}
        <ChangePasswordDialog
          handleClose={handlePasswordClose}
          open={openPassword}
        />
      </>
    }

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
      <ProfileContent
        page={page}
        handleEditClickOpen={handleEditClickOpen}
        handlePasswordClickOpen={handlePasswordClickOpen}
      />
    </Paper>
  </>;
};

export default DesktopProfileCard;
