import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, CircularProgress, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Notification from '../components/toastNotification';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'; 
import { fetchMissionDetails, claimRefund } from '../redux/slices/missionSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Confirm from './confirm';
import Cancel from './cancel';

const ClaimRefund = () => {
  const [attachment1, setAttachment] = useState(null);
  const [missionDetail, setMissionDetail] = useState(null);
  const [summary, setSummary] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [id, setId] = useState('');

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    const formattedValue = formatNumber(value);
    // Check if the input contains non-numeric characters
    if (/^\d*(,\d{3})*$/.test(formattedValue)) {
      setAmount(formattedValue);
      setMessage('');
    } else {
      setMessage('Please enter numbers only.'); // Set message for invalid input
    }
  };

  const formatNumber = (value) => {
    // Remove non-numeric characters and format with commas
    const numericValue = value.replace(/,/g, ''); // Remove existing commas
    if (!/^\d*$/.test(numericValue)) return value; // Return if not a valid number
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas
  };


  const { missionDetails, hasFetched, loading, error } = useSelector(state => state.myMissions);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    if (missionDetails && missionDetails.length > 0) {
      const newMission = missionDetails.find(m => m.referenceId === id);
      if (newMission) {
        setMissionDetail(newMission);
      }
    }
  }, [id, missionDetails]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched) {
        await dispatch(fetchMissionDetails());
      }
    };
    fetchData();
  }, [dispatch, hasFetched]);

  const handleFileUpload = (event, setAttachment) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setAttachment(file);
    } else {
      toast.error('Please upload a PDF document.');
    }
  };

  const handleRemoveAttachment = (setAttachment) => {
    setAttachment(null);
  };

  const handleSummary = (e) => {
    setSummary(e.target.value);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (amount === '') {
      setNotification({ message: 'mission amount claim is required!', type: 'error' });
      return;
    }

    if (!summary) {
      setNotification({ message: 'summary is required!', type: 'error' });
      return;
    }

    if (attachment1 === null) {
      setNotification({ message: 'File document are required!', type: 'error' });
      return;
    }

    // Create FormData for files
    const formData = new FormData();
    formData.append('summary', summary);
    formData.append('amount', parseFloat(amount.replace(/,/g, '')));
    formData.append('claimFile', attachment1);

    dispatch(claimRefund({ referenceId: id, missionData: formData }))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission refund claimed successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/my-missions");
      }, 3000);
    })
    .catch((error) => {
      setNotification({ message: error["message"], type: 'error' });
    });

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      {missionDetail ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              mt: 2,
            }}
          >
            <Typography
              sx={{
                height: '30px',
                fontSize: '0.85rem',
                textAlign: 'center',
                backgroundColor: '#5982b2',
                borderRadius: '10px',
                fontWeight: 'semibold',
                color: 'white',
                width: '500px',
                lineHeight: '35px',
              }}
            >
              MISSION REFUND CLAIM: {id}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center', 
            gap: 2 ,
            m: 3,
            mb:1.5,
            ml: 3
            }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', color:'black' }}>
              Mission Amount Claim (Rwf) 
            </Typography>
            <TextField
              variant="outlined"
              type="text" // Use text to avoid numeric keypad
              value={amount}
              onChange={handleChange}
              placeholder="Enter Mission Amount Claim"
              sx={{
                width: '100%', // Use full width of the container
                maxWidth: '300px', // Set a maximum width
                minWidth: '150px', // Set a minimum width
                '& .MuiOutlinedInput-root': {
                  height: '2rem',
                  '& input': {
                    padding: '4px 8px',
                    fontSize: '0.90rem',
                  },
                },
              }}
            />
            
          </Box>
          {message && (
              <Typography variant="body2" sx={{ display: 'flex', justifyContent:'center', color:'red', fontSize: '0.75rem', mt: -1 , ml:5}}>
                {message}
              </Typography>
            )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              p: 1,
            }}
          >
            <TextField
              label="Provide a short summary of the mission refund claim, HERE"
              multiline
              rows={6}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  mb: 0.2,
                  fontSize: '0.75rem',
                  mt: -1,
                  width: '470px',
                  lineHeight: '1rem',
                },
              }}
              InputLabelProps={{
                sx: { fontSize: '0.85rem', width: 'auto' },
              }}
              onChange={handleSummary}
              value={summary}
            />
          </Box>

          {/* <Box
            sx={{
              mt: 2,
              mb: 2,
              p: 2,
              border: '2px dashed #999',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60%',
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="attachment1"
              type="file"
              onChange={(event) => handleFileUpload(event, setAttachment)}
            />
            <label htmlFor="attachment1" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <UploadFileIcon sx={{ fontSize: 40, color: '#999', mr: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'black',
                  fontSize: '0.75rem',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                }}
              >
                {attachment1 ? attachment1.name : 'Click to upload Mission refund claim (PDF only)'}
              </Typography>
            </label>
            {attachment1 && (
              <IconButton
                color="error"
                onClick={() => handleRemoveAttachment(setAttachment)}
                sx={{ mt: 1 }}
              >
                <CloseIcon />
                <Typography variant="button" sx={{ ml: 0.1, color: 'error', fontSize: '0.65rem' }}>
                  Remove
                </Typography>
              </IconButton>
            )}
          </Box> */}
             <Box
            sx={{
              mt: 1,
              mb: 1,
              p: 1,
              border: '2px dashed #999',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60%',
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            <input
              accept=".pdf"
              style={{ display: 'none' }}
              id="attachment"
              type="file"
              onChange={(event) => handleFileUpload(event, setAttachment)} // Now only accepts a single file
            />
            <label htmlFor="attachment" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
              <UploadFileIcon sx={{ fontSize: 40, color: '#999', mr: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'black',
                  fontSize: '0.75rem',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                }}
              >
                {attachment1 ? attachment1.name : 'Click to upload Mission Report Attachments (PDF only)'}
              </Typography>
            </label>
            {attachment1 && (
              <Box
              sx={{
                display: 'flex',         // Align children horizontally
                alignItems: 'center',    // Center items vertically
                cursor: 'pointer',       // Add pointer cursor for click feedback
                gap: 1,                  // Add some space between the elements
              }}
            >
              <input
                accept=".pdf"
                style={{ display: 'none' }}
                id="changeAttachment"
                type="file"
                onChange={(event) => handleFileUpload(event, setAttachment)}
              />
              <label htmlFor="changeAttachment" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <UploadFileIcon sx={{ color: 'blue', mr: 1 }} />
                <Typography sx={{ color: 'blue', fontSize: '0.75rem' }}>
                  Change File
                </Typography>
              </label>
              {attachment1 && (
                <Box
                  color="red"
                  onClick={() => handleRemoveAttachment(setAttachment)}
                  sx={{
                    display: 'flex',         // Align children horizontally
                    alignItems: 'center',    // Center items vertically
                    cursor: 'pointer',       // Add pointer cursor for click feedback
                  }}
                >
                  <DeleteForeverIcon sx={{ color: 'red' }} />
                  <Typography sx={{ ml: 0.5, color: 'red', fontSize: '0.65rem' }}>
                    Remove
                  </Typography>
                </Box>
              )}
            </Box>
            
            
            )}
          </Box>


          
          <ToastContainer />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1, ml: 5 }}>
            <Confirm onClick={handleFormSubmit}/>
            <Cancel />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Alert severity="error">Mission request not found.</Alert>
        </Box>
      )}
    </Box>
  );
};

export default ClaimRefund;
