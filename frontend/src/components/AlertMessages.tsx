/* Show all alerts and success / error messages in app wide */

import React, { useState } from 'react';
import api from '../services/api';
import { Snackbar, SnackbarCloseReason, Alert } from '@mui/material';

export const AlertMessages: React.FC = () => {
  // States
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);

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

  // Axios interceptor for after response to handle error / success messages
  api.interceptors.response.use(
    (response) => {
      // Set success messages
      if (response.data?.message) {
        setSeverity(true);
        setMessage(response.data.message);
        setSnackOpen(true);
      }
      return response;
    },

    // Set error messages
    (error) => {
      // Throttling message
      if (error.response?.status === 429) {
        setSeverity(false);
        setMessage(error.response.statusText);
        setSnackOpen(true);

        // Other messages
      } else if (error.response?.data?.message) {
        setSeverity(false);
        setMessage(error.response.data.message);
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
    {/* Alert */}
    <Snackbar
      open={snackOpen}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity ? 'success' : 'error'}
      >
        {message}
      </Alert>
    </Snackbar>
  </>;
};
