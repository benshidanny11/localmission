import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Grid,
  Typography, CircularProgress,Alert} from '@mui/material';
import { computeMission, fetchMissionDetails } from '../redux/slices/missionForComputationSlice';
import ComputeSheet from './computeSheet_btn';
import Confirm from './confirm';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import Notification from '../components/toastNotification';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Cancel from './cancel';

function ComputeMissionAllowance() {
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [mission, setMission] = useState({});
  const dispatch = useDispatch();
  const [distance, setDistance] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [publicTransportAllowance, setPublicTransportAllowance] = useState(0);
  const [bankCode, setBankCode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [destinations, setDestinations] = useState([]);
  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.computationMissions);
  const [total, setTotal] = useState(0);
  const [totalReal, setTotalReal] = useState(0);
  const [transportGen, setTransportGen] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const missionId = params.get('id');
    if (missionId) {
      setId(missionId);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched && !loading && !error && (!missionDetails || missionDetails.length === 0)) {
        await dispatch(fetchMissionDetails());
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, dispatch, missionDetails, hasFetched, loading, error]);

  useEffect(() => {
    if (missionDetails && missionDetails.length > 0) {
      const missionNew = missionDetails.find(m => m.referenceId === id);
      if (missionNew) {
        setMission(missionNew);
        setDestinations(missionNew.missionDestinations);
        setDistance(missionNew.distance || 0);
        setMileage(missionNew.mileage || 0);
        if(missionNew.transportMode !== 'PRIVATE_CAR'){
          setPublicTransportAllowance(missionNew.transportMileageAllowance || 0);
        }
        setMileage(missionNew.mileage || 0);
        if (missionNew.employee.bankDetails) {
          const { bankCode, bankAccount, bankName } = missionNew.employee.bankDetails;
          setBankCode(bankCode || '');
          setBankAccount(bankAccount || '');
          setBankName(bankName || '');

        } else {
          setBankCode('');
          setBankAccount('');
          setBankName('');
        }
      }
    }
  }, [id, missionDetails]);

  useEffect(() => {
    calculateTotal();
  }, [destinations, mission.transportMode]);

  const calculateTotal = () => {
    let newTotal = 0;

    // Calculate allowance for each destination
    if (destinations && destinations.length > 0) {
      destinations.forEach(destination => {
        const { numberOfDays, dayRate, numberOfNights, nightRate } = destination;
        newTotal += (numberOfDays * dayRate) + (numberOfNights * nightRate);
      });
    }

    // Add mileage allowance if applicable
    if (mission.transportMode === "PRIVATE_CAR") {
      newTotal += parseFloat(distance) * parseFloat(mileage);
    }

    // Add public transport allowance if applicable
    if (mission.transportMode !== "PRIVATE_CAR") {
      newTotal += parseFloat(publicTransportAllowance);
    }

    setTotal(newTotal);
    setTotalReal(newTotal);
  };

  const handleConfirm = async () => {

    if (mission.transportMode !== "TRANSPORT_SPONSOR") {
      if(transportGen === 0 || transportGen === ''){
        setNotification({message:'Please Generate computation sheet first', type:'error'});
        return;
      }
     }

    if (mission.transportMode === "PRIVATE_CAR") {
      if(distance === null || distance === 0 || mileage ===  null || mileage === 0){
        setNotification({message:'Please fill out the Distance and Mileage', type:'error'});
        return;
      }else{
        setTransportGen(parseFloat(distance) * parseFloat(mileage));
        // setTotal((prev)=> parseFloat(prev) + (parseFloat(distance) * parseFloat(mileage)));
      }
    }
    if (mission.transportMode === "PUBLIC_CAR" || mission.transportMode === "RRA_VEHICLE" || mission.transportMode === "HIRED_CAR") {
      if(publicTransportAllowance === null || publicTransportAllowance === 0){
        setNotification({message:'Please fill out Public transport allowance',type:'error'});
        return;
      }else{
        setTransportGen(publicTransportAllowance);
        // setTotal((prev)=> prev + publicTransportAllowance);
      }
    }

    if (mission.transportMode === "TRANSPORT_SPONSOR") {
      setTransportGen(publicTransportAllowance);
    }

    if(bankName === null || bankName === '' || bankAccount ===  null || bankAccount === '' || bankCode === null || bankCode === ''){
      setNotification({message:'Please fill out all details about bank', type:'error'});
      return;
    }else{

      try {
        // If employee bank details do not exist, create new bank details
        const response = mission.employee.bankDetails === null
          ? await axiosInstance.post('/BankDetails', {
              bankCode: bankCode,
              bankAccount: bankAccount,
              bankName: bankName,
              employeeId: mission.employee.employeeId
            })
          : await axiosInstance.put(`/BankDetails/${mission.employee.employeeId}`, {
              bankCode: bankCode,
              bankAccount: bankAccount,
              bankName: bankName
            });

            const missionData = {
              "distance": distance,
              "mileage": mileage,
              "transportMileageAllowance": transportGen,
              "totalAmount": total
            }

            dispatch(computeMission({ referenceId: mission.referenceId, missionData }))
              .unwrap()
              .then(() => {
                setNotification({ message: 'Mission computed successfully', type: 'success' });
                setTimeout(() => {
                  navigate("/missions-allowance-computation");
                }, 1000);
              })
              .catch((error) => {
                console.log(error);
                setNotification({ message: error["message"], type: 'error' });
              });
              
      } catch (error) {
        console.log(error)
        setNotification({ message: 'An error occurred while saving bank details', type: 'error' });
      }

    }
  }

  const generateFunction = () => {

    if (mission.transportMode === "PRIVATE_CAR") {
      if(distance === null || distance === 0 || mileage ===  null || mileage === 0){
        setNotification({message:'Please fill out the Distance and Mileage', type:'error'});
        return;
      }else{
        setTransportGen(parseFloat(distance) * parseFloat(mileage));
        setTotal(totalReal + (parseFloat(distance) * parseFloat(mileage)));
        return;
      }
    }
    if (mission.transportMode === "PUBLIC_CAR" || mission.transportMode === "RRA_VEHICLE" || mission.transportMode === "HIRED_CAR") {
      if(publicTransportAllowance === null || publicTransportAllowance === 0){
        setNotification({message:'Please fill out Public transport allowance',type:'error'});
        return;
      }else{
        setTransportGen(parseFloat(publicTransportAllowance));
        setTotal(totalReal + parseFloat(publicTransportAllowance));
      }
    }

    if(mission.transportMode === "TRANSPORT_SPONSOR") {
      setTransportGen(parseFloat(publicTransportAllowance));
      setTotal(totalReal + parseFloat(publicTransportAllowance));
    }

  }

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
          <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
        <Typography sx={{
          mt: -2,
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: 'semibold',
          mb: 2,
          backgroundColor: '#5982b2',
          p: 0.8,
          textAlign: 'center',
          borderRadius: '5px'
        }}>
          MISSION FEE COMPUTATION DETAILS - Mission Order Number {id}
        </Typography>

        {/* Bank Details & Mileage Section */}
        <Paper sx={{ mb: 1.5, p: 2 }}>
  <Grid container spacing={2}>
    {/* Bank Details Section */}
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', mb: 1, color: 'black' }}>Bank Details</Typography>
      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={8} display="flex" alignItems="center">
          <Box sx={{ width: '80px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Bank Account:
            </Typography>
          </Box>
          <Grid item xs={12} sm={8} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              value={bankAccount}
              placeholder="Enter bank account"
              onChange={(e) => setBankAccount(e.target.value)}
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.6rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={8} display="flex" alignItems="center">
          <Box sx={{ width: '80px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Bank Name:
            </Typography>
          </Box>
          <Grid item xs={12} sm={8} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Enter bank name"
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.6rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={8} display="flex" alignItems="center">
          <Box sx={{ width: '80px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Bank Code:
            </Typography>
          </Box>
          <Grid item xs={12} sm={8} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              value={bankCode}
              placeholder="Enter bank code"
              onChange={(e) => setBankCode(e.target.value)}
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.6rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>

    {/* Mileage Section */}
    <Grid item xs={12} sm={6}>
      <Typography sx={{ fontSize: '0.65rem', fontWeight: 'bold', mb: 1, color: 'black' }}>Mileage</Typography>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Box sx={{ width: '100px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Mileage:
            </Typography>
          </Box>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="0"
              value={mileage}
              disabled={mission.transportMode !== "PRIVATE_CAR"}
              onChange={(e) => setMileage(e.target.value)}
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.8rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Box sx={{ width: '100px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Distance /Km:
            </Typography>
          </Box>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="0"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              disabled={mission.transportMode !== "PRIVATE_CAR"}
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.8rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Box sx={{ width: '100px', display: 'flex', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Mileage Allowance:
            </Typography>
          </Box>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="0"
              value={distance * mileage ? (distance * mileage).toLocaleString() : 0}
              disabled
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.8rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="center" mb="5px">
        <Grid item xs={12} sm={6} display="flex" alignItems="center">
          <Box sx={{ width: '100px', display: 'flex', justifyContent: 'flex-end', mr: 2 }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.60rem', fontWeight: 'semibold' }}>
              Public Transport Allowance:
            </Typography>
          </Box>
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              placeholder="0"
              value={publicTransportAllowance}
              onChange={(e) => setPublicTransportAllowance(e.target.value)}
              disabled={mission.transportMode === "PRIVATE_CAR" || mission.transportMode === "TRANSPORT_SPONSOR"}
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '1.8rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    
  </Grid>
  <Box sx={{
          mt: 1,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <ComputeSheet onClick={generateFunction}/>
        </Box>
</Paper>





        {/* Table Section */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#5982b2' }}>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Bank-Name</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Bank-Code</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Bank-Account</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Days</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Days/Rate</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Nights</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Nights/Rate</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Transport</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px' }}>Amount to Pay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && destinations.map(({ district, numberOfDays, dayRate, numberOfNights, nightRate }, index) => {
                const isLastRow = index === destinations.length - 1;
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{bankName === '' ? '-' : bankName}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{bankCode === '' ? '-' : bankCode}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{bankAccount === '' ? '-' : bankAccount}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{district.districtName}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{numberOfDays}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{Number.parseInt(dayRate).toLocaleString()} Rwf</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{numberOfNights}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{Number.parseInt(nightRate).toLocaleString()} Rwf</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{isLastRow ? transportGen.toLocaleString() : '0'} Rwf</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                      {
                        !isLastRow ?
                        `${((numberOfDays * dayRate) + (numberOfNights * nightRate)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Rwf`
                          :
                          `${((numberOfDays * dayRate) + (numberOfNights * nightRate) + transportGen).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Rwf`
                      }
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={9} sx={{ fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', backgroundColor: '#a9a9a9' }}>Total</TableCell>
                <TableCell sx={{ fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', backgroundColor: '#a9a9a9' }}>{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Rwf</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/*  confirm $ cancel btns */}
        <Box sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
        }}>
          <Confirm onClick={handleConfirm}/>
          <Cancel/>
          
        </Box>
      </Box>
  );
}

export default ComputeMissionAllowance;