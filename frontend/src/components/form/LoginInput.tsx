import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FilledInput, FormControl, FormHelperText,
  IconButton, InputAdornment, InputLabel, TextField
} from '@mui/material';
import { useState } from 'react';



interface LoginProps {
  username: string;
  setUsername: (username: string) => void;
  usernameMessage: string | null;
  password: string;
  setPassword: (password: string) => void;
  passwordMessage: string | null;
}



const LoginInput: React.FunctionComponent<LoginProps> = ({
  username, setUsername, usernameMessage,
  password, setPassword, passwordMessage
}) => {
  // State variables - Show / hide / update
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // State variables - Form validations
  const [filledUsername, setFilledUsername] = useState<boolean>(true);
  const [filledPassword, setFilledPassword] = useState<boolean>(true);

  // Username validation
  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setFilledUsername(value.length > 0);
    setUsername(value);
  };

  // Password validation
  const handleFilledPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setFilledPassword(value.length > 0);
    setPassword(value);
  };

  // Password show/hide
  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  return <>
    <TextField
      value={username}
      onChange={handleUsername}
      error={!filledUsername}
      required
      label='Username'
      id="filled-username"
      variant="filled"
      placeholder="john-doe"
      helperText={usernameMessage}
      sx={{
        '& .MuiFormHelperText-root': {
          color: 'error.main',
        },
      }}
    />


    {/* Password */}
    <FormControl variant="filled" required error={!filledPassword}>
      <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
      <FilledInput
        value={password}
        onChange={handleFilledPassword}
        error={!filledPassword}
        required
        id="filled-adornment-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        inputProps={{ minLength: 8 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={true}>{passwordMessage}</FormHelperText>
    </FormControl>
  </>;
};

export default LoginInput;
