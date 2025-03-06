/* Show all alerts and success / error messages from pages */

import React, { useState, useEffect } from 'react';
import { Snackbar, SnackbarCloseReason, Alert } from '@mui/material';

interface Message {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export const PageMessages: React.FC<Message> = ({ message, severity }) => {
  // States
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  useEffect(() => {
      setSnackOpen(true);
  }, [message]);

  // Alert handler
  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };


  return <>
    {/* Alert */}
    <Snackbar
      open={snackOpen}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant='filled'
      >
        {message}
      </Alert>
    </Snackbar>
  </>;
};
