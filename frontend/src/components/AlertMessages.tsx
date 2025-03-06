/* Show all alerts and success / error messages in app wide */

import React, { useState } from 'react';
import api from '../services/api';
import { Snackbar, SnackbarCloseReason, Alert } from '@mui/material';

export const AlertMessages: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackOpen(false);
  };

  // Axios interceptor for after response to handle error / success messages
  api.interceptors.response.use(
    (response) => {
      if (response.data?.message) {
        setSeverity(true);
        setMessage(response.data.message);
        setSnackOpen(true);
      }
      return response;
    },

    (error) => {
      // Throttling message
      if (error.response?.status === 429) {
        setSeverity(false);
        setMessage(error.response.statusText);
        setSnackOpen(true);

        // Other messages
      } else if (error.response?.data) {
        setSeverity(false);
        setMessage(error.response?.data?.detail || error.response.data.message || error.message);
        setSnackOpen(true);

      } else {
        setSeverity(false);
        setMessage(`Unable to fetch: ${error.message}`);
        setSnackOpen(true);
      }
      return Promise.reject(error);
    }
  );

  return <>
    <Snackbar
      open={snackOpen}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity ? 'success' : 'error'}
        variant='filled'
      >
        {message}
      </Alert>
    </Snackbar>
  </>;
};
