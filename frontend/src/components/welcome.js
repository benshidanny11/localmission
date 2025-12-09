import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionDetails } from '../redux/slices/missionSlice';


const WelcomePage = () => {
    const dispatch = useDispatch();
    const { fullnames } = useSelector(state => state.user);
    useEffect(()=> {
        dispatch(fetchMissionDetails());
        console.log(fetchMissionDetails);
      }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        textAlign: 'center',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: 3,
      }}
    >
      {/* Welcome Text */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{ color: '#000000', fontWeight: 'semibold' }}
        >
          { fullnames },
        </Typography>
        <Typography
          variant="h4"
          component="h4"
          sx={{ color: '#004d40'  }}
        >
          Welcome
          <WavingHandIcon sx={{ color: '#FFD700', ml: 1 }} /> {/* Sun yellow color with margin */}
        </Typography>
      </Box>

      {/* Main Message Box */}
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
          mb: 15,
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: '1.2rem',
            color: '#276b80',
            fontWeight: 'bold',
            mb: 2,
            borderRadius: '10px',
          }}
        >
          LOCAL MISSION MANAGEMENT SYSTEM
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomePage;
