import React from 'react';
import { Button } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
const GenerateReport = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={<FilePresentIcon sx={{ fontSize: 9 }} />} 
      sx={{
        height: 28, // Adjusted height for better usability
        width: '125px', // Auto width to fit content
        fontSize: '0.65rem',
        padding: '4px 8px',
        mt:3.6,
        textTransform: 'none',
        backgroundColor: 'green', // Set custom background color
        '&:hover': {
          backgroundColor: 'darkgreen', // Darken on hover
        },
      }}
    >
      Generate Report
    </Button>
  );
};

export default GenerateReport;
