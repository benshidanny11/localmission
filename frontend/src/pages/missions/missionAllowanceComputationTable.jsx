import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../../components/sidebar';
import MissionAllowanceTable from '../../components/missionAllowanceTable';

import Header from '../../components/header';

function MissionAllowanceComputation() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
            <MissionAllowanceTable />
          }
        </Box>
      </Box>
    </Box>
  );
}

export default MissionAllowanceComputation;
