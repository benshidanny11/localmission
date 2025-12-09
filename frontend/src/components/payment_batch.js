import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Alert } from '@mui/material';
import DescriptionInput from './textArea';
import Confirm from './confirm';
import Cancel from './cancel'; // Import Cancel component
import Payment from './payment_table';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Notification from '../components/toastNotification'; 
import { fetchMissionDetails, createPaymentBatch } from '../redux/slices/missionComputationForPaymentBatchReducer';

function Batch() {
    const Navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [description, setDescription] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const dispatch = useDispatch();
    const { missionDetails, loading, error, hasFetchedForMissionDetails } = useSelector(state => state.paymentBatchDetails);

    const handleSelectRow = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow.referenceId !== row.referenceId));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleConfirm = ()=> {
      if(selectedRows.length === 0 ){
        setNotification({message:'Please choose at least one mission request.',type:'error'});
        return;
      }

      if(description.length === 0 ){
        setNotification({message:'Description cannot be empty',type:'error'});
        return;
      }

      const ids = selectedRows.map((mission) => mission.referenceId);
      const data = {
        missionId : ids,
        description: description,
        IBAN:"",
        paymentType:"01-NET"
      }
      dispatch(createPaymentBatch(data))
      .unwrap()
      .then(() => {
        setNotification({ message: 'Mission payment batch created successfully', type: 'success' });
        setTimeout(() => {
          Navigate("/mission-payments");
        }, 1000);
      })
      .catch((error) => {
        setNotification({ message: error["message"], type: 'error' });
      });
    }

    const handleCancelClick = () => {
        setOpenDialog(true);
    };

    useEffect(() => {
        if (!hasFetchedForMissionDetails) {
            dispatch(fetchMissionDetails());
        }
    }, [dispatch, hasFetchedForMissionDetails]);

    const handleDialogClose = (confirm) => {
        setOpenDialog(false);
        if (confirm) {
            setShowPayment(true);
        } else {
            console.log('Cancellation canceled');
        }
    };

    const closeNotification = () => {
      setNotification({ message: '', type: '' });
    };

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

    if (showPayment) {
        return <Payment />;
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2 }}>
                MISSION PAYMENT BATCH CREATION
            </Typography>

            {/* First Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#5982b2' }}>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>SN</TableCell>
                            {/* <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Staff ID & Name</TableCell> */}
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Mission Reference</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Destination</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Start Date</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>End Date</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Mission Amount</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Transport Allowance</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Select</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                          missionDetails.length > 0 ? (
                            missionDetails.map((mission, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{index + 1}</TableCell>
                                {/* <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                                    {mission.employee.employeeId+" - "+mission.employee.givenName +" "+mission.employee.familyName}
                                </TableCell> */}
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                                    {mission.employee.givenName +" "+mission.employee.familyName}
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.referenceId}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.missionDestinations.map(dest => dest.district.districtName).join(', ')}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.startDate}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.endDate}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.missionAllowance.toLocaleString() +" Rwf"}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.transportMileageAllowance? mission.transportMileageAllowance.toLocaleString() +" Rwf" : '-'}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{mission.status.replace(/_/g, ' ').toLowerCase()}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                                    <Checkbox
                                        sx={{ p: 0.1 }}
                                        checked={selectedRows.includes(mission)}
                                        onChange={() => handleSelectRow(mission)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                                <Alert severity="info">No missions found.</Alert>
                              </TableCell>
                            </TableRow>
                          )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Second Table */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#575554' }}>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>SN</TableCell>
                            {/* <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Beneficiary Id</TableCell> */}
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Beneficiary Name</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Beneficiary Bank-Account</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>IBAN</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Beneficiary Bank-Code</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Payment Type</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                          selectedRows.length > 0 ? (
                            selectedRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{index + 1}</TableCell>
                                {/* <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.employeeId}</TableCell> */}
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.givenName +" "+row.employee.familyName}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.bankDetails ? row.employee.bankDetails.bankAccount : 'Not found'}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{''}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.bankDetails ? row.employee.bankDetails.bankCode : 'Not found'}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{'01-NET'}</TableCell>
                                <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.totalAmount ? row.totalAmount.toLocaleString() +" Rwf" : "-"}</TableCell>
                            </TableRow>
                        ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '12px 4px' }}>
                                You have not selected any missions yet.
                              </TableCell>
                            </TableRow>
                          )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <DescriptionInput description={description} setDescription={setDescription} />
            <Box sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
            }}>
                <Confirm onClick={handleConfirm}/>
                <Cancel onClick={handleCancelClick} />
            </Box>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
                <DialogTitle variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold'}}>Cancel Mission Payment Batch Creation</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '0.85rem' }}>Are you sure you want to cancel? Any unsaved changes will be lost.</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={() => handleDialogClose(false)}
                        sx={{
                            display: 'inline-block',
                            border: '1px solid red', // Red border for "No" button
                            color: 'red', // Matching text color
                            borderRadius: '8px', // Optional: Add rounded corners
                            padding: '2px 4px', // Optional: Add padding for better appearance
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.1)', // Optional: Light red background on hover
                            },
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => Navigate("/mission-payments")}
                        sx={{
                            display: 'inline-block',
                            border: '1px solid green', // Green border for "Yes" button
                            color: 'green', // Matching text color
                            borderRadius: '8px', // Optional: Add rounded corners
                            padding: '2px 4px', // Optional: Add padding for better appearance
                            '&:hover': {
                                backgroundColor: 'rgba(0, 128, 0, 0.1)', // Optional: Light green background on hover
                            },
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>

            </Dialog>
        </Box>
    );
}

export default Batch;