import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { ToastContainer, toast } from 'react-toastify';
import Notification from '../components/toastNotification';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'; 
import { fetchMissionDetails, submitMissionReport } from '../redux/slices/missionSlice';

import Confirm from './confirm';
import Cancel from './cancel';

const UploadMissionReport = () => {
  const [attachment1, setAttachment1] = useState(null);
  const [attachment2, setAttachment2] = useState(null); // Changed to single file
  const [missionDetail, setMissionDetail] = useState(null);
  const [summary, setSummary] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [id, setId] = useState('');

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

    

    if (!summary) {
      setNotification({ message: 'summary is required!', type: 'error' });
      return;
    }

    if (attachment1 === null) {
      setNotification({ message: 'One file is required!', type: 'error' });
      return;
    }

    // Create FormData for files
    const formData = new FormData();
    formData.append('reportFiles', attachment1);
    if(attachment2 != null) {
      formData.append('reportFiles', attachment2);
    }
    formData.append('summary', summary);

    dispatch(submitMissionReport({ referenceId: id, missionData: formData }))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission reported successfully!", type: 'success' });
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
                mb:2
              }}
            >
              MISSION REPORT - {id}
            </Typography>
          </Box>

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
              label="Provide a short summary of the mission report, HERE"
              multiline
              rows={6}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  fontSize: '0.75rem',
                  width: '470px',
                
                  height: '300px'
                },
              }}
              InputLabelProps={{
                sx: { fontSize: '0.85rem', width: 'auto' },
              }}
              onChange={handleSummary}
              value={summary}
            />
          </Box>

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
              id="attachment1"
              type="file"
              onChange={(event) => handleFileUpload(event, setAttachment1)}
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
                {attachment1 ? attachment1.name : 'Click to upload Signed Mission Report (PDF only)'}
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
               onChange={(event) => handleFileUpload(event, setAttachment1)}
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
                 onClick={() => handleRemoveAttachment(setAttachment1)}
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
              id="attachment2"
              type="file"
              onChange={(event) => handleFileUpload(event, setAttachment2)} // Now only accepts a single file
            />
            <label htmlFor="attachment2" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
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
                {attachment2 ? attachment2.name : 'Click to upload Mission Report Attachments (PDF only) (Optional)'}
              </Typography>
            </label>
            {attachment2 && (
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
                onChange={(event) => handleFileUpload(event, setAttachment2)}
              />
              <label htmlFor="changeAttachment" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <UploadFileIcon sx={{ color: 'blue', mr: 1 }} />
                <Typography sx={{ color: 'blue', fontSize: '0.75rem' }}>
                  Change File
                </Typography>
              </label>
              {attachment2 && (
                <Box
                  color="red"
                  onClick={() => handleRemoveAttachment(setAttachment2)}
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

export default UploadMissionReport;
