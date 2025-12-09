import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; 
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          padding: 3,
          borderRadius: 2,
          zIndex: 1,
          textAlign: 'center',
          height: '100vh',
          // width: '100%', // Ensure the Box takes full width
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center all content vertically
        }}
      >
        <Typography variant="h2" component="h2" gutterBottom sx={{ fontSize: '4rem', mt:-20 }}>
          404
        </Typography>
        <Typography variant="h6" component="p" sx={{ fontSize: '1.25rem' }}>
          Page Not Found
        </Typography>
        <Typography variant="h6" component="p" sx={{ fontSize: '0.85rem' }}>
          Sorry, we can't find the page you are looking for.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Center the button horizontally
            width: '100%', // Make sure the container takes full width
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={()=>navigate('/')}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              textTransform: 'none',
              borderRadius: '20px'
            }}
          >
            <HomeIcon sx={{ mr: 1, fontSize: '1rem' }} /> {/* Add icon here */}
            Back to Home
          </Button>
        </Box>
      </Box>
      <Box
        component="img"
        src="/assets/bg_rra_logo.png" // Replace with your image URL
        alt="Background"
        sx={{
          position: 'absolute',
          bottom: 50,
          right: 0,
          width: 150,
          height: 'auto',
          opacity: 0.9,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default NotFoundPage;
