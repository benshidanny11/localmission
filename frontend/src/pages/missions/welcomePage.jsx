import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Welcome from '../../components/welcome'; 
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';

function WelcomePage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
            <Welcome />
          }
        </Box>
      </Box>
    </Box>
  );
}

export default WelcomePage;
