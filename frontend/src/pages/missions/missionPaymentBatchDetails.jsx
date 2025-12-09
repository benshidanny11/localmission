import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Sidebar from '../../components/sidebar';
import Header from '../../components/header';
import PaymentBatchDetails from '../../components/paymentBatchDetails';


function MissionPaymentBatchDetails() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
            <PaymentBatchDetails />
          }
        </Box>
      </Box>
    </Box>
  );
}

export default MissionPaymentBatchDetails;
