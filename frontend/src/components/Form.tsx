import {
  Box, Stack, Button, Typography, Link, CircularProgress
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';
import { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { PageMessages } from './PageMessages';
import { Link as RouterLink } from 'react-router-dom';
import { useAccessToken } from '../hooks/useAccessToken';
import RegisterInput from './form/RegisterInput';
import LoginInput from './form/LoginInput';



interface PageProps {
  page: 'login' | 'register';
}

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
  is_teacher?: boolean;
  subject?: string[];
}

// API response
interface ApiResponse {
  access?: string | undefined;
  refresh?: string | undefined;
}

// Error response types
interface ErrorResponse {
  detail: string;
  username?: string;
  password?: string;
  confirm?: string;
  is_teacher?: string;
  subject?: string
}

const Form: React.FC<PageProps> = ({ page }) => {
  // State variables - Show / hide / update
  const [message, setMessage] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);

  // State variables - Datas to send
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [is_teacher, setIsTeacher] = useState<boolean>(false);
  const [subject, setSubject] = useState<string[]>([]);

  // State variables - Datas taken
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [isTeacherMessage, setIsTeacherMessage] = useState<string | null>(null);
  const [subjectMessage, setSubjectMessage] = useState<string | null>(null);

  // State variables - Form validations
  const [filledSelect, setFilledSelect] = useState<boolean>(true);

  // State variables - Loadings
  const [isSubjectsLoading, setIsSubjectsLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const { setAccess } = useAccessToken();

  const navigate: NavigateFunction = useNavigate();



  // Fetch subfects from server
  const fetchSubjects = async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.SUBJECT_LIST);

      setSubjects(response.data);
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
    if (is_teacher && page === 'register') {
      fetchSubjects();
    } else {
      // Clean the subjects and validations if isTeacher is false
      setSubject([]);
      setSubjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_teacher]);


  // Register new user or Login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonLoading(true);

    const body: PostType = {
      username,
      password,
    };

    if (page === 'register') {
      body.username = username;
      body.confirm = confirm;
      body.subject = subject;
      body.is_teacher = is_teacher;
    };


    try {
      const response: AxiosResponse<ApiResponse> = await api.post(
        `${page === 'register' ? ENDPOINTS.REGISTER : ENDPOINTS.LOGIN}`, body
      );

      // Clean inputs
      setUsername('');
      setPassword('');

      // Clean messages
      setPasswordMessage(null);

      if (page === 'register') {
        // Clean inputs of register page
        setConfirm('');
        setIsTeacher(false);
        setSubject([]);
        setSubjects([]);

        // clean messages of register page
        setUsernameMessage(null);
        setConfirmMessage(null);
        setIsTeacherMessage(null);
        setSubjectMessage(null);
      } else if (response.data.access && response.data.refresh) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setAccess(response.data.access);
      }

      setMessage(`You will be redirected ${page === 'register' ? 'to Login page' : 'to Home page'} in 5 seconds.`);

      setCounter(5);

      setButtonLoading(false);


    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      // show field notifications
      if (err.response?.data?.username) {
        setUsernameMessage(err.response?.data?.username);
      }
      if (err.response?.data?.password) {
        setPasswordMessage(err.response?.data?.password);
      }
      if (err.response?.data.confirm) {
        setConfirmMessage(err.response.data.confirm);
      }
      if (err.response?.data.is_teacher) {
        setIsTeacherMessage(err.response.data.is_teacher);
      }
      if (err.response?.data.subject) {
        setSubjectMessage(err.response.data.subject);
      }
      setButtonLoading(false);
      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };

  // Count to 0 before navigate user
  useEffect(() => {
    // Don't start if counter is already 0
    if (counter <= 0) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        prev = prev - 1;
        setMessage(`You will be redirected ${page === 'login' ? 'to Home page' : 'to Login page'} in ${prev} seconds.`);
        if (prev <= 0) {
          clearInterval(interval);
          navigate(page === 'login' ? '/' : '/login');
        }
        return prev;
      });
    }, 1000);

    // Cleanup function to clear the interval when component unmounts or counter reaches 0
    return () => clearInterval(interval);
  }, [counter, navigate, page]);


  return <>
    {
      message &&
      <PageMessages message={message} severity='info' />
    }
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      mt={3}
    >

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Stack
          direction='column'
          spacing={2}
          border='1px solid'
          borderColor='text.disabled'
          borderRadius={2}
          p={2}
          width={350}
        >
          <Typography
            mb={3}
            variant="h5"
          >
            {
              page === 'register' ? 'Register' : 'Login'
            }
          </Typography>

          {/* Login and register fields */}
          <LoginInput
            username={username}
            setUsername={setUsername}
            usernameMessage={usernameMessage}
            password={password}
            setPassword={setPassword}
            passwordMessage={passwordMessage}
          />

          {/* Registration inputs */}
          {
            page === 'register' && <>
              {/* Confirm Password */}
              <RegisterInput
                confirm={confirm}
                setConfirm={setConfirm}
                confirmMessage={confirmMessage}
                is_teacher={is_teacher}
                setIsTeacher={setIsTeacher}
                isTeacherMessage={isTeacherMessage}
                isSubjectsLoading={isSubjectsLoading}
                filledSelect={filledSelect}
                setFilledSelect={setFilledSelect}
                subject={subject}
                setSubject={setSubject}
                subjects={subjects}
                subjectMessage={subjectMessage}
              />
            </>
          }

          {/* Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={buttonLoading}
          >
            {
              buttonLoading ? <CircularProgress size={25} /> :
                (
                  page === 'register' ? 'Register' : page === 'login' ? 'Login' : 'Send'
                )
            }
          </Button>
        </Stack>
      </form>

      <Stack direction='column' alignItems='center' mt={1} spacing={0.5}>
        {
          page === 'register' && <>
            <Typography variant="body2" color="text.disabled">This website is for demonstration purposes only.</Typography>
            <Typography variant="body2" color="warning.main">Please do NOT enter any real personal information!</Typography>
          </>
        }
        <Stack direction='row' alignItems='center'>
          <Typography variant="body2" color="text.disabled">
            {
              page === 'register' ?
                'Do you have an account already?'
                : page === 'login' && 'You don\'t have an account yet?'
            }
          </Typography>
          <Link component={RouterLink} to={page === 'register' ? '/login' : '/register'}>
            {page === 'login' ? 'Register instead' : page === 'register' && 'Login instead'}
          </Link>
        </Stack>
        <Stack direction='row' alignItems='center'>
          <Typography variant="body2" color="text.disabled">
            Do you have questions?
          </Typography>
          <Link component={RouterLink} to='/faq'>Look up F.A.Q. page</Link>
        </Stack>

      </Stack>
    </Box>
  </>;
};

export default Form;
