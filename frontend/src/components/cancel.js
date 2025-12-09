import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const Navigate = useNavigate();
  return (
    <Button
      variant="contained"
      onClick={() => Navigate(-1)}
      sx={{
        height: 28,
        width: '5%',
        fontSize: '0.75rem',
        padding: '2px 4px',
        textTransform: 'none',
        backgroundColor: 'red',
        '&:hover': {
          backgroundColor: 'darkred',
        },
      }}
    >
      Cancel
    </Button>
  );
};

export default Cancel;
