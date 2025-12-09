import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import ExportPaymentBatch from './exportPaymentBatch_btn';
import Cancel from './cancel';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaymentBatches } from '../redux/slices/missionComputationForPaymentBatchReducer';

function PaymentBatchDetails() {
  const location = useLocation();
  const [id, setId] = useState('');
  const dispatch = useDispatch();
  const [missionPaymentBatchSingle, setMissionPaymentBatchSingle] = useState(null);
  const { missionPaymentBatch, loading, error, hasFetchedForMissionPayment } = useSelector(state => state.paymentBatchDetails);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    if (missionPaymentBatch && missionPaymentBatch.length > 0) {
      const newMission = missionPaymentBatch.find(m => m.sn === id);
      if (newMission) {
        setMissionPaymentBatchSingle(newMission);
      }
    }
  }, [id, missionPaymentBatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetchedForMissionPayment) {
        await dispatch(fetchPaymentBatches());
      }
    };
    fetchData();
  }, [dispatch, hasFetchedForMissionPayment]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">Failed to load mission details: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography sx={{ 
        fontSize: '0.75rem', 
        fontWeight: 'bold', 
        mt: -2, 
        backgroundColor: '#5982b2', 
        p: 0.8, 
        textAlign: 'center', 
        borderRadius: '5px' ,
        color:'white'
      }}>
        MISSION PAYMENT  - Mission Order Number {id}
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#575554' }}>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>SN</TableCell>
              {/* <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Beneficiary ID</TableCell> */}
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Beneficiary Name</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Beneficiary Bank-Account</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Beneficiary Bank-Name</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Beneficiary Bank-Code</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>IBAN</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Payment Type</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              missionPaymentBatchSingle !== null && missionPaymentBatchSingle.missionDetails !== null ? (
                missionPaymentBatchSingle.missionDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{index + 1}</TableCell>
                    {/* <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employeeId}</TableCell> */}
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.familyName + " " +row.givenName}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.bankAccount}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.bankName}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.bankCode}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{''}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{missionPaymentBatchSingle.paymentType}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{new Intl.NumberFormat().format(row.amount)} Rwf</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}></TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Button */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <ExportPaymentBatch 
        missionOrderNumber={missionPaymentBatchSingle?.missionOrderNumber} 
        rows={missionPaymentBatchSingle?.missionDetails} 
        id={id} // Pass the id here
      />
      <Cancel />
      </Box>
      
    </Box>
  );
}

export default PaymentBatchDetails;
