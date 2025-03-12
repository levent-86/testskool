import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button, Dialog, DialogActions,
  DialogContent, DialogTitle,
  FilledInput, FormControl,
  FormHelperText, IconButton,
  InputAdornment, InputLabel,
  Stack
} from '@mui/material';
import React, { useState } from 'react';

interface EditTypes {
  open: boolean;
  handleClose: () => void;
}

export const ChangePasswordDialog: React.FC<EditTypes> = ({ open, handleClose }) => {
  const [oldPassword, setOldPassword] = useState<string | null>();
  const [password, setPassword] = useState<string | null>();
  const [confirmNewPassword, setConfirmNewPassword] = useState<string | null>();

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [oldPasswordMessage, setOldPasswordMessage] = useState<string | null>('');
  const [passwordMessage, setpasswordMessage] = useState<string | null>('');
  const [newPasswordMessage, setNewPasswordMessage] = useState<string | null>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setOldPassword(value);
  };


  // Old password show/hide
  const handleClickShowPassword = (): void => setShowOldPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return <>
    <Dialog
      open={open}
      onClose={handleClose}
      scroll='body'
      closeAfterTransition={false}
    >
      <DialogTitle>Edit your profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            {/* Old password */}
            <FormControl variant="filled">
              <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
              <FilledInput
                value={oldPassword}
                onChange={handleOldPassword}
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                inputProps={{ minLength: 8 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showOldPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText error={true}>{oldPasswordMessage}</FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  </>;
};
