import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';


const CreateMissionPaymentBatch = () => {
  const Navigate = useNavigate();
  return (
    <Button onClick={() => Navigate("/mission-batch")}
      variant="contained"
      color="primary"
      startIcon={
        <AddToPhotosIcon sx={{ 
          fontSize: 18, // Adjust icon size
          marginRight: '0px', // Reduce space between icon and text
        }} />
      }
      sx={{
        height: 30,  // Adjust height
        width: '15rem', // Adjust width (auto to fit content)
        fontSize: '0.75rem', // Reduce font size
        padding: '4px 8px', // Adjust padding for a smaller button
        textTransform: 'none', // Disable uppercase transformation'
      }}
    >
      Create Mission Payment Batch
    </Button>
  );
};

export default CreateMissionPaymentBatch;


