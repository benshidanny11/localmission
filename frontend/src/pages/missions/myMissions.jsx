import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Mission from '../../components/user_mission_table';

import Header from '../../components/header';

function MyMission() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
            <Mission />
          }
        </Box>
      </Box>
    </Box>
  );
}

export default MyMission;
