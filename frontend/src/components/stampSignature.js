import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const StampAndSignature = ({ approver, dateData, jobTitle }) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Simulating a JSON object with multiple image URLs
  const imageData = {
    images: [
      `${process.env.REACT_APP_BACKEND_URL}/files/${approver.employeeId}.png`,
    ]
  };

  console.log(approver);

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Set the image URLs from the JSON-like object
    const fetchImageUrls = () => {
      setImageUrls(imageData.images);
    };

    fetchImageUrls();
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: -3, mb: 2, ml: 0 }}>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <Box key={index} sx={{ flexShrink: 0, width: 100, height: 100, mr: 1 }}>
            <img
              src={url}  // Dynamically set image URLs
              alt={`Stamp ${index + 1}`}  // Corrected alt attribute with template literal
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
        ))
      ) : (
        <Typography>Loading images...</Typography>  // Show a loading message while images are being set
      )}
      <Box sx={{ ml: 2 }}>
        <Typography sx={{ fontSize: '0.65rem', color: 'black' }}>
          <Box component="div" sx={{ mb: 0.5 }}>Digitally Signed by</Box>
          <Box component="div" sx={{ mb: 0.5 }}>{jobTitle}</Box>
          <Box component="div" sx={{ mb: 0.5 }}>Date: {dateData}</Box>
          <Box component="div">
            Time: ({timezone})
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default StampAndSignature;
