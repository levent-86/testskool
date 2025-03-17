import React, { useState } from 'react';
import { EditDialog } from './EditDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import {
  Accordion, AccordionDetails, AccordionSummary,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProfileContent } from './ProfileContent';

interface ProfileCardProps {
  page: 'my-profile' | 'profile';
}

export const MobileProfileCard: React.FC<ProfileCardProps> = ({ page }) => {
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

    <Accordion sx={{ width: '100%', mt: '1rem' }}>

      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{ justifySelf: 'center' }}
      >
        Profile Details
      </AccordionSummary>

      <AccordionDetails>
        <ProfileContent
          page={page}
          handleEditClickOpen={handleEditClickOpen}
          handlePasswordClickOpen={handlePasswordClickOpen}
        />
      </AccordionDetails>
    </Accordion>
  </>;
};
