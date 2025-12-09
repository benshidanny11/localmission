import React from 'react';
import { Button } from '@mui/material';

const ComputeSheet = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        height: 28, // Adjusted height for better usability
        width: 'auto', // Auto width to fit content
        fontSize: '0.75rem',
        padding: '4px 8px',
        textTransform: 'none',
        backgroundColor: '#FFA500',
        '&:hover': {
          backgroundColor: '#e59400',
        },
      }}
    >
      Generate Computation Sheet
    </Button>
  );
};

export default ComputeSheet;
