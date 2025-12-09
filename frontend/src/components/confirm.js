import React from 'react';
import { Button } from '@mui/material';

const Confirm = ({onClick}) => {
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
        backgroundColor: 'green', // Set custom background color
        '&:hover': {
          backgroundColor: 'darkgreen', // Darken on hover
        },
      }}
    >
      Confirm
    </Button>
  );
};

export default Confirm;
