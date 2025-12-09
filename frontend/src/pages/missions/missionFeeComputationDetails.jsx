import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';
import ComputeMissionAllowance from '../../components/computeMissionAllowance';


function MissionFeeComputationDetails() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
            <ComputeMissionAllowance />
          }
        </Box>
      </Box>
    </Box>
  );
}

export default MissionFeeComputationDetails;
