import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

const CreateRequest = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await axiosInstance.get('/missionDetails/unsubmitted-report-check');
      if (response.data.status === 409) {
        setOpen(true);
        setMessage(response.data.message);
      } else {
        navigate('/mission-form');
      }
    } catch (error) {
      console.error("Error checking unsubmitted reports", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={
          <AddToPhotosIcon sx={{ 
            fontSize: 18, 
            marginRight: '0px' 
          }} />
        }
        sx={{
          height: 30,  
          width: '12rem',
          fontSize: '0.75rem',
          padding: '4px 8px',
          textTransform: 'none',
        }}
        onClick={handleClick}
      >
        Create Mission Request
      </Button>

      <Dialog open={open} onClose={handleClose} sx={{p:2}}>
        <DialogTitle 
            sx={{
              fontWeight:'bold',
              fontSize: '0.80rem',
              color: 'purple',
              position: 'relative',
              paddingBottom: '8px', // Add some space for the bottom line
              '&::after': {
                content: '""',
                display: 'block',
                width: '100%', // Line matches the width of the title
                height: '2px', // Thickness of the line
                backgroundColor: 'purple', // Same color as the title
                position: 'absolute',
                bottom: 0,
                left: 0,
              },
            }}
        >SUBMISSION REQUIRED</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.75rem', color: 'black' , mt:2}}>{message}</Typography>
        </DialogContent>
        <DialogActions>
        <Button
      onClick={handleClose}
      sx={{
        color: 'white',
        fontSize: '0.65rem',
        backgroundColor: 'darkred', // Set the background color
        '&:hover': {
          backgroundColor: 'red', // Darken the background on hover
        },
        padding: '2px 4px', // Adjust padding if needed
        borderRadius: '4px', // Optional: Add border radius for rounded corners
      }}
    >
      Close
    </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateRequest;
