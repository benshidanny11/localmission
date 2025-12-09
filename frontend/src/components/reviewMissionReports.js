import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, CircularProgress, Button, Alert } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent'; 
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'; 
import { fetchMissionDetails, } from '../redux/slices/missionSlice';

const ReviewMissionReport = () => {
  const [missionDetail, setMissionDetail] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const getLabelByDocType = (docType) => {
    switch (docType) {
      case 'SUPPORT':
        return 'Mission support documents';
      case 'REPORT':
        return 'Attached Mission report';
      case 'REFUND':
        return 'Mission refund documents';
      default:
        return 'Mission document';
    }
  };
  
  const groupedFiles = missionDetail?.missionFiles?.reduce((acc, file) => {
    const docType = file.missionDocType;
    if (!acc[docType]) {
      acc[docType] = [];
    }
    acc[docType].push(file);
    return acc;
  }, {}) || {};

  return (
    <Box>
      <Typography sx={{ 
        fontSize: '0.75rem', 
        fontWeight: 'semibold', 
        textAlign: 'center', 
        mb: 2, 
        mt:1,
        backgroundColor: '#5982b2', 
        p: 0.8, 
        borderRadius: '10px' ,
        color:'white',
        width: '500px',
        mx: 'auto',              // Center the Typography horizontally
        display: 'block'         // Ensure block display for width and margin auto to work
  
      }}>
        MISSION REPORT & SUPPORT DOCUMENTS
      </Typography>

      <Box 
      sx={{ textAlign: 'center', mt:2,mb:-3, ml:-41.2 }}
      >
  <Typography
      variant="caption"
      sx={{
        fontSize: '0.85rem',
        fontWeight: 'bold',
      }}
    >
      Mission Report Summary
    </Typography>
  </Box>

      {missionDetail ? (
        <>
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    p: 1,
  }}
>
  

  <Box
    sx={{
      width: '500px',
      height: '150px',
      p: 2,
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      mt: 3,
      overflowY: 'auto', // Enable vertical scrolling
    }}
  >
    
    
    <Typography
      variant="body2"
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {missionDetail.reportSummary}
    </Typography>
  </Box>
</Box>


          <Box
            sx={{
              borderRadius: '8px',
              padding: '16px',
              // width: '100%',
              p: 1,
              margin: 'auto',
            }}
          >
            <Typography
              sx={{
                color: 'black',
                textAlign: 'center', // Centers the text horizontally
                fontWeight: 'bold',  // Optional: Makes the text bold
                fontSize: '1rem',    // Optional: Adjust font size
                mb: 1,               // Optional: Adds margin below the text
              }}
            >
              All Mission Files
            </Typography>

            {Object.keys(groupedFiles).map((docType) => (
      <Box
        key={docType}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff',
          width: '500px',
          margin: 'auto',
          marginBottom: 2, // Space between different doc types
        }}
      >
        {/* Label for the document type */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilePresentIcon sx={{ mr: 2, color: '#555' , mt:0}} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
              fontSize: 11,
              mt:0
            }}
          >
            {getLabelByDocType(docType)}
          </Typography>
        </Box>

        {/* Files for this document type displayed together */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Stack files vertically
            alignItems: 'flex-start',
            ml: 2, // Add some left margin
          }}
        >
          {groupedFiles[docType].map((file, index) => (
            <Link
              key={file.id}
              href={`${process.env.REACT_APP_BACKEND_URL}/files/${file.missionFile}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'block', mb: 1 }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: 'primary.main',
                  whiteSpace: 'nowrap',
                  mr:2,
                }}
              >
                {`${getLabelByDocType(docType)}${index + 1}.pdf`}
              </Typography>
            </Link>
          ))}
        </Box>
      </Box>
    ))}
          </Box>

          
          <ToastContainer />
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1, ml: 5 }}>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                height: 28,
                width: '5%',
                fontSize: '0.75rem',
                padding: '2px 4px',
                textTransform: 'none',
                backgroundColor: '#696969',
                mt:-4,
                '&:hover': {
                  backgroundColor: '#708090',
                },
              }}
            >
              Exit
            </Button>
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

export default ReviewMissionReport;
