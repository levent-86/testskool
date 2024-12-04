import {
  Box, Stack, FormControl, TextField, InputLabel, FilledInput,
  InputAdornment, IconButton, Button, Switch, FormGroup,
  FormControlLabel, Select, MenuItem, SelectChangeEvent,
  Checkbox, ListItemText, Typography, Link, Skeleton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';


// GET req. data interface
interface Subject {
  id: number;
  name: string;
}

// POST req. data interface
interface PostType {
  username: string;
  password: string;
  confirm?: string;
  isTeacher?: boolean;
  subject?: string[];
}

const Register: React.FC = () => {
  // State variables - Show / hide / update
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false);

  // State variables - Datas to send
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [subject, setSubject] = useState<string[]>([]);

  // State variables - Datas taken
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // State variables - Form validations
  const [filledUsername, setFilledUsername] = useState<boolean | undefined>(undefined);
  const [filledPassword, setFilledPassword] = useState<boolean | undefined>(undefined);
  const [filledConfirm, setFilledConfirm] = useState<boolean | undefined>(undefined);
  const [filledSelect, setFilledSelect] = useState<boolean | undefined>(undefined);

  // State variables - Loadings
  const [isSubjectsLoading, setIsSubjectsLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);


  // Password show/hide
  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  // Confirm show/hide
  const handleClickShowConfirm = (): void => setShowConfirm((show) => !show);

  const handleMouseDownConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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

  // Confirm validation
  const handleFilledConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setFilledConfirm(value.length > 0);
    setConfirm(value);
  };


  // Select/option handler
  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;

    // Make sure the incoming values from SelectChangeEvent are string[]
    if (Array.isArray(value)) {
      setSubject(value);  // Add choosen subjects in to the subject
    };

    // Select validation
    setFilledSelect(value.length > 0);
  };


  // Fetch subfects from server
  const fetchSubjects = async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.GET_SUBJECTS);

      setSubjects(response.data);
      setIsSelectDisabled(false);
      setIsSubjectsLoading(false);

    } catch (error) {
      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };

  // useEffect for Fetch subjects
  useEffect(() => {
    // Fetch subjects only if isTeacher is true
    if (isTeacher) {
      fetchSubjects();
    } else {
      // Clean the subjects and validations if isTeacher is false
      setSubject([]);
      setSubjects([]);
      setFilledSelect(undefined);
    }
  }, [isTeacher]);


  // Register new user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonLoading(true);

    const body: PostType = {
      username,
      password,
      confirm,
      subject,
      isTeacher
    };

    try {
      await api.post(ENDPOINTS.REGISTER, body);

      // Clean inputs
      setUsername('');
      setPassword('');
      setConfirm('');
      setIsTeacher(false);
      setSubject([]);
      setSubjects([]);

      setButtonLoading(false);


    } catch (error) {
      setButtonLoading(false);
      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };


  return <>
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >



      {/* Welcoming */}
      <Typography mt={2} variant="h3" sx={{ fontWeight: 'bold' }}>
        Welcome To TestSkool
      </Typography>
      <Typography mb={2} variant="h4" sx={{ fontWeight: 'bold' }}>
        Join Us Today!
      </Typography>


      {/* Register form */}
      <form onSubmit={handleSubmit}>
        <Stack direction='column' spacing={2} border='1px solid' borderColor='text.disabled' borderRadius={2} p={2}>

          {/* Username */}
          <TextField
            value={username}
            onChange={handleUsername}
            error={!(filledUsername === true || filledUsername === undefined)}
            required
            label='Username'
            id="filled-username"
            variant="filled"
            placeholder="john-doe"
          />

          {/* Password */}
          <FormControl variant="filled" required>
            <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
            <FilledInput
              value={password}
              onChange={handleFilledPassword}
              error={!(filledPassword === true || filledPassword === undefined)}
              required
              id="filled-adornment-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
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
          </FormControl>

          {/* Confirm Password */}
          <FormControl variant="filled" required>
            <InputLabel htmlFor="filled-adornment-confirm-password">Confirm Password</InputLabel>
            <FilledInput
              value={confirm}
              onChange={handleFilledConfirm}
              error={!(filledConfirm === true || filledConfirm === undefined)}
              required
              id="filled-adornment-confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Password Confirmation"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showConfirm ? 'hide the confirm' : 'display the confirm'
                    }
                    onClick={handleClickShowConfirm}
                    onMouseDown={handleMouseDownConfirm}
                    onMouseUp={handleMouseUpConfirm}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Switch and subject select */}
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={isTeacher}
                  onChange={() => {
                    setIsTeacher(!isTeacher);
                  }} />
              } label="I'm a teacher!"
            />
          </FormGroup>

          {
            isTeacher && <>
              {
                isSubjectsLoading
                  ? (
                    <Skeleton data-testid='skeleton' variant="rectangular" width={270} height={60} />
                  )
                  : <FormControl required disabled={isSelectDisabled} error={isSelectDisabled} variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="subjects">Select Your Subject</InputLabel>
                    <Select<string[]>
                      labelId="subjects"
                      id="simple-select-filled"
                      multiple
                      value={subject}
                      onChange={handleSelectChange}
                      error={!(filledSelect === true || filledSelect === undefined)}
                      renderValue={(selected) => selected.join(', ')}
                      sx={{ width: 270 }}
                    >
                      {
                        subjects.map(s => (
                          <MenuItem key={s.id} value={s.name}>
                            <Checkbox checked={subject.includes(s.name)} />
                            <ListItemText primary={s.name} />
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
              }

              <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                You can choose more than one subject.
              </Typography>
            </>
          }

          <Button
            type="submit"
            variant="contained"
            disabled={buttonLoading}
          >{buttonLoading ? <CircularProgress size={25} /> : 'Submit'}</Button>
        </Stack>
      </form>

      <Stack direction='column' alignItems='center' mt={1}>
        <Typography variant="body2" color="text.disabled">This website is for demonstration purposes only.</Typography>
        <Typography variant="body2" color="warning.main">Please do NOT enter any real personal information!</Typography>
        <Stack direction='row' alignItems='center'>
          <Typography variant="body2" color="text.disabled">
            Do you have an account already?
          </Typography><Link href='/login'>Login instead</Link>
        </Stack>
        <Stack direction='row' alignItems='center'>
          <Typography variant="body2" color="text.disabled">
            Do you have questions?
          </Typography><Link href='/faq'>Look up F.A.Q. page</Link>
        </Stack>

      </Stack>
    </Box>
  </>;
};

export default Register;
