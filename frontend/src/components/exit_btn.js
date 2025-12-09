import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Exit = () => {
  const Navigate = useNavigate();
  return (
    <Button
      variant="contained"
      onClick={() => Navigate(-1)}
      sx={{
        height: 28,
        width: '5%',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        padding: '2px 4px',
        textTransform: 'none',
        backgroundColor: '#696969',
        '&:hover': {
          backgroundColor: '#708090',
        },
      }}
    >
      Exit
    </Button>
  );
};

export default Exit;
