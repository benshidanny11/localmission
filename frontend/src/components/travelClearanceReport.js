import React from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';

import XIcon from '@mui/icons-material/X';
import LanguageIcon from '@mui/icons-material/Language';
import CallIcon from '@mui/icons-material/Call';

import TravelClearanceTable from './travelClearanceTable';

import  { forwardRef } from 'react';

const TravelClearanceReport = forwardRef((props, ref) => {
  return (
    <Card
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Makes the card take up the full height of the viewport
      }}
    >
      <CardHeader
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        title={
          <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%', // Ensure the Box takes the full width
                borderBottom: '2px solid transparent',
                borderImage: 'linear-gradient(to right, #276b80 0%, #276b80 33%, #228b22 33%, #228b22 66%, #ffa500 66%, #ffa500 100%) 1', // Gradient border
                paddingBottom: '2px', // Adjust padding if needed
              }}
            >
            {/* Left Side */}
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 10,
                flexGrow: 1, // Make sure this Box takes up the remaining space
                mb:1
              }}
            >
              <img 
                src="Assets/bg_rra_logo.png" 
                style={{ width: 100, height: 'auto', marginRight: 8, marginBottom: 2 }} 
                alt="Logo"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '0.80rem', color: '#276b80' }}>
                    RWANDA REVENUE AUTHORITY
                </Typography>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold', fontSize: '0.75rem', color: '#276b80', mt:-0.8 }}>
                    TAXES FOR GROWTH AND DEVELOPMENT
                </Typography>
                </Box>
            </Box>
            
            {/* Right Side */}
            <Typography 
              variant="subtitle2"  // Reduced font size
              component="div" 
              sx={{ 
                mb:1,
                fontWeight: 'bold', 
                color: 'green', // Make the text red
                position: 'relative', 
                marginLeft: 'auto', 
                marginRight: 20,
                transform: 'rotate(0deg)', // Tilt the text slightly
                fontSize: '1.2rem', // Reduce the font size of "INTERNAL"
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  left:0,
                  right: 0,
                  height: '2px',
                  backgroundColor: 'green', // Red border color
                },
                '&::before': {
                  top: '-1px', // Adjusted position for the top line
                },
                '&::after': {
                  bottom: '-1px', // Adjusted position for the bottom line
                },
              }}
            >
              INTERNAL
            </Typography>
          </Box>
        }
      />

      {/* Content Area */}
      <Box 
  sx={{ 
    flexGrow: 1, 
    position: 'relative', 
    overflow: 'hidden' // Ensure no overflow or scrolling
  }}
>
  {/* Add the transparent image */}
  <img 
    src="Assets/bg_rra_logo.png" 
    style={{ 
      position: 'absolute', 
      top: '43%', 
      left: '110%', 
      transform: 'translate(-50%, -50%)', // Center and tilt the image
      // width: 'auto', 
      height: '100%', 
      opacity: 0.1, // Adjust opacity to make the image transparent
      zIndex: 0 // Ensure the image is behind other content
    }} 
    alt="Background Logo"
  />

  {/* Other content goes here */}
  
  <TravelClearanceTable data={props.data}/>
  
</Box>


      {/* Footer */}
      <CardContent 
        sx={{
          padding: 1,
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          alignItems: 'center',
          position: 'relative',
          // marginTop: '-20px', // Ensures footer stays at the bottom
          mb: 10
        }}
      >
        {/* Line with centered text */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            width: '100%', // Full width
            marginBottom: 2, // Space between the line and the footer text
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              width: '50%',
              height: '2px',
              background: 'linear-gradient(to right, #276b80 0%, #276b80 33%, #228b22 33%, #228b22 66%, #ffa500 66%, #ffa500 100%)',
              zIndex: 0,
            },
            '&::before': {
              left: 0,
              marginRight: '8px',
            },
            '&::after': {
              right: 0,
              marginLeft: '8px',
            },
          }}
        >
          <Typography 
  variant="body2" 
  component="div" 
  sx={{ 
    fontWeight: 'semibold',
    position: 'relative',
    zIndex: 1,
    display: 'inline-flex', // Use inline-flex for layout
    alignItems: 'center', // Center align vertically
    background: '#fff', // Background to cover lines behind text
    padding: '0 8px',
    fontSize: '0.75rem'
  }}
>
  {/* Vertical Text Column */}
  <Box 
    sx={{ 
      display: 'flex',
      flexDirection: 'column', // Arrange text in a vertical column
      marginLeft: '10px', // Space between horizontal and vertical text
    }}
  >
    <Typography 
  variant="body2" 
  component="div" 
  sx={{ 
    fontWeight: 'bold',
    fontSize: '1rem',
    display: 'flex',
    whiteSpace: 'nowrap', // Prevent wrapping of text
  }}
>
  <span style={{ color: '#276b80', marginRight: '2px' }}>HERE</span> 
  <span style={{ color: '#228b22', marginRight: '2px' }}>FOR</span> 
  <span style={{ color: '#ffa500' }}>YOU</span>
</Typography>

    <Typography 
      variant="body2" 
      component="div"
      sx={{ 
        display:'flex',
        justifyContent:'center',
        fontWeight: 'bold',
        color: 'green',
        fontSize: '1rem',
        whiteSpace: 'nowrap' // Prevent wrapping of vertical text
      }}
    >
      TO SERVE
    </Typography>
  </Box>
</Typography>

        </Box>

        {/* Footer Text */}
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%', // Full width
            marginBottom: '-30px'
          }}
        >
          <Typography 
            variant="body2" 
            component="div" 
            sx={{ 
              fontWeight: 'semibold' ,
              mt: '-27px',
              ml: 5,
              fontSize: '0.60rem',
               color: '#276b80'
            }}
          >
            Kicukiro-Sonatube-Silverback Mall, P.O.Box 3987 Kigali, Rwanda
          </Typography>

          <Typography 
      variant="body2" 
      component="div" 
      sx={{ 
        fontWeight: 'semibold',
        mt: '-30px',
        fontSize: '0.60rem',
        color: '#276b80',
        display: 'flex', // Flexbox to align items
        alignItems: 'center', // Center items vertically
      }}
    >
      {/* Icon with Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 0.6 }}>
        <CallIcon sx={{ marginRight: 0.2, fontSize: 'small', mt:-0.8 }} /> {/* Icon with spacing */}
        <Typography variant="body2" component="span" sx={{ marginRight: 5, fontSize: '0.60rem', mt:-0.8 }}>
          3004
        </Typography>
      </Box>

      {/* Icon with Text */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
        <LanguageIcon sx={{ marginRight: 0.2, fontSize: 'small', mt:-0.8 }} /> {/* Icon with spacing */}
        <Typography variant="body2" component="span" sx={{ marginRight: 5, fontSize: '0.60rem', mt:-0.8 }}>
          www.rra.gov.rw
        </Typography>
      </Box>

      {/* Icon with Text */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <XIcon sx={{ marginRight: 0.2, fontSize: 'small', mt:-0.8 }} /> {/* Icon with spacing */}
        <Typography variant="body2" component="span" sx={{ marginRight: 10, fontSize: '0.60rem', mt:-0.8 }}>
          @rrainfo
        </Typography>
      </Box>
    </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

export default TravelClearanceReport;
