import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { Box } from '@mui/material';
import DesktopProfileCard from './profile/DesktopProfileCard';
import { ProfileActivityPanel } from './profile/ProfileActivityPanel';


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
      {/* Profile card */}
      <DesktopProfileCard />

      {/* Activity panel */}
      <ProfileActivityPanel />
    </Box>
  </>;
};

export default ProfileLayout;
