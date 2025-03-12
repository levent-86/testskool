import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { Box } from '@mui/material';
import DesktopProfileCard from './profile/DesktopProfileCard';


interface PageProps {
  page: 'my-profile' | 'profile';
};

const ProfileLayout: React.FC<PageProps> = ({ page }) => {
  const { userData } = useUserData();
  // console.log(userData);


  return <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      }}>
      <DesktopProfileCard />
      <p>Hello, world.</p>
      <p>Şu anda {page} sayfasındayız.</p>
    </Box>
  </>;
};

export default ProfileLayout;
