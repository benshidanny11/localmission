import React, { useState } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';

const DescriptionInput = ({ description, setDescription }) => {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (event) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/);
    if (words.length <= 20) {
      setDescription(text);
      setWordCount(words.length);
    }
  };

  return (
    <Box sx={{ width: '80%', maxWidth: '500px', m: 'auto', mt: 3 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={3}>
          <Typography variant="h6" sx={{ fontSize: '0.75rem', fontWeight: 'semibold', mb: 4, ml: -2 }}>
            Description
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            multiline
            rows={2} // Reduced number of rows to decrease height
            variant="outlined"
            fullWidth
            value={description}
            onChange={handleChange}
            placeholder="Enter up to 20 words..."
            sx={{
              '& .MuiInputBase-input': {
                boxShadow: 'none',
                mt: -2,
                ml: -1.5,
                fontSize: '0.75rem', // Reduced font size
                minHeight: '20px', // Reduced min height of the textarea
                padding: '2px 4px', // Adjusted padding for a compact appearance
              },
            }}
          />
          <Typography variant="caption" color={wordCount > 20 ? 'error' : 'textSecondary'} sx={{ mt: 0.5 }}>
            {wordCount} / 20 words
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DescriptionInput;
