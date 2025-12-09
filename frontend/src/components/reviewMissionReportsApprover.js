import React, { useState, useEffect } from 'react';
import { Box, Typography, Link, CircularProgress, Button, Alert, DialogActions, DialogContent, TextField, DialogTitle, Backdrop, Dialog } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent'; 
import { ToastContainer } from 'react-toastify';
import Notification from '../components/toastNotification';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css'; 
import { fetchMissionDetails, rejectMissionReport, approverMissionReport } from '../redux/slices/missionForApprovalSlice';
import Exit from './exit_btn';
import axiosInstance from '../utils/axiosConfig';

const ReviewMissionReportApprover = () => {
  const [missionDetail, setMissionDetail] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { username } = useSelector(state => state.user);
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [id, setId] = useState('');

  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.approvalMissions);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async()=> {
      if (missionDetails && missionDetails.length > 0) {
        const newMission = missionDetails.find(m => m.referenceId === id);
  
        if(newMission == null) {
          const response = await axiosInstance.get(`/missionDetails/reference?referenceId=${id}`);
          newMission = response.data;
        }
        if (newMission) {
          setMissionDetail(newMission);
          setIsDisabled(newMission.status !== "REPORTED");
        }
      }
    }

    if(id) {
      fetchData();
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setConfirmationOpen(false);

    dispatch(approverMissionReport({ referenceId: id }))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission report approved successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/missions-for-approval");
      }, 3000);
    })
    .catch((error) => {
      setNotification({ message: error["message"], type: 'error' });
    });

  };

  const handleReject = () => {
    setDetailedDialogOpen(false);

    if (!reason) {
      setNotification({ message: 'summary is required!', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('reason', reason);

    dispatch(rejectMissionReport({ referenceId: id, reason: formData }))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission report Rejected successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/missions-for-approval");
      }, 3000);
    })
    .catch((error) => {
      setNotification({ message: error["message"], type: 'error' });
    });
    setReason('');

  }

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  }; 

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    const wordCount = newValue.split(/\s+/).filter(Boolean).length;

    if (wordCount <= 50) {
      setReason(newValue);
    }
  };

  const wordCount = reason.split(/\s+/).filter(Boolean).length;

  const handleConfirmationClose = (confirm) => {
    setConfirmationOpen(false);
    if (confirm) {
      setDetailedDialogOpen(true);
    }
  };

  const handleDetailedDialogClose = () => {
    setDetailedDialogOpen(false);
    setReason('');
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
      <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
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
            {
              missionDetail.approver.employeeId === username && (
                <>
                  <Button
                    variant="contained"
                    onClick={()=> setConfirmationOpen(true)}
                    disabled={isDisabled}
                    sx={{
                      height: 28, // Adjusted height for better usability
                      width: 'auto', // Auto width to fit content
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      textTransform: 'none',
                      backgroundColor: 'green', // Set custom background color
                      '&:hover': {
                        backgroundColor: 'darkgreen', // Darken on hover
                      },
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    onClick={()=> setDetailedDialogOpen(true)}
                    disabled={isDisabled}
                    sx={{
                      height: 28, // Adjusted height for better usability
                      width: 'auto', // Auto width to fit content
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      textTransform: 'none',
                      backgroundColor: 'red', // Set custom background color
                      '&:hover': {
                        backgroundColor: 'darkred', // Darken on hover
                      },
                    }}
                  >
                    Reject
                  </Button>
                </>
              )
            }
            <Exit />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Alert severity="error">Mission request not found.</Alert>
        </Box>
      )}

      <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
        <DialogTitle sx={{ fontSize: '0.85rem', padding: '12px' , color:'black'}}>
          Are you sure you want to Approve mission report?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={handleFormSubmit}
            sx={{
              border: '1px solid #388e3c',
              padding: '2px 4px',
              fontSize: '0.65rem',
              color: '#ffff',
              backgroundColor:'green',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => handleConfirmationClose(false)}
            sx={{
              border: '1px solid #d32f2f',
              padding: '2px 4px',
              fontSize: '0.65rem',
              color: '#ffff',
              backgroundColor:'red',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop open={detailedDialogOpen} sx={{ zIndex: 1300 }}>
        <Dialog
          open={detailedDialogOpen}
          onClose={handleDetailedDialogClose}
          sx={{
            width: '1000px', // Increased width
            maxWidth: '90vw', // Responsive width
            margin: 'auto', // Center the dialog
          }}
        >
          <DialogTitle
            sx={{
              ml:3,
              mr:3,
              mt:1,
              color: 'black',
              marginBottom: '4px',
              fontSize: '0.78rem', // Font size for title
              backgroundColor: '#696969',
              padding: '4px',
              textAlign: 'center', // Center the title text
              borderRadius: '5px'
            }}
          >
            Mission report reject
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reason}
              onChange={handleTextChange}
              placeholder="Provide the reasons why Mission report is rejected not more than 50 words"
              helperText={`Word Count: ${wordCount} / 50 words`} 
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  fontSize: '0.75rem',
                  width: '400px',
                  mt:-1.5,
                },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              padding: '8px',
            }}
          >
            
            <Button
              onClick={handleReject}
              sx={{
                padding: '2px 4px',
                fontSize: '0.65rem',
                textTransform: 'none',
                color: '#ffffff',
                backgroundColor: 'green',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={handleDetailedDialogClose}
              sx={{
                padding: '2px 4px',
                fontSize: '0.65rem',
                textTransform: 'none',
                color: '#ffffff',
                backgroundColor: 'red',
                border: '1px solid #d32f2f',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </Box>
  );
};

export default ReviewMissionReportApprover;
