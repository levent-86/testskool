import { Box, Stack, Typography, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LinkedIn, GitHub, QuestionMark } from '@mui/icons-material';

const NoPage: React.FC = () => {
  return <>
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack direction='column' alignItems='center' spacing={5}>
        <Typography variant="h1">
          404
        </Typography>
        <Typography>
          Sorry, Page Not Found.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">To Home Page</Button>

        <Stack direction='row' alignItems='center' spacing={5}>
          <Link
            href='https://www.linkedin.com/in/mustafaleventfidanci/'
            underline="none" target="_blank" color='inherit'
            data-testid='linkedin'
          >
            <LinkedIn fontSize="large" />
          </Link>

          <Link
            href='https://www.github.com/levent-86/'
            underline="none" target="_blank" color='inherit'
            data-testid='github'
          >
            <GitHub fontSize="large" />
          </Link>

          <Link
            component={RouterLink}
            to='/faq'
            underline="none" color='inherit'
            data-testid='faq'
          >
            <QuestionMark fontSize="large" />
          </Link>
        </Stack>
      </Stack>
    </Box>
  </>;
};

export default NoPage;
