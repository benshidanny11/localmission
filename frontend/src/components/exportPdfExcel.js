import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';

const ExportButton = ({ onExport }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    onExport(format); // Trigger the export action with selected format
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          height: 28,
          fontSize: '0.65rem',
          mt:3.6,
          backgroundColor: '#5982b2',
          '&:hover': {
            backgroundColor: '#00008b',
          },
        }}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ width: '150px', height:'180px', mt:0.5 }}
      >
        <MenuItem 
        onClick={() => handleExport('pdf')}
        sx={{ fontSize: '0.70rem', p:1, mt:-1 }}
        >
          <PictureAsPdfIcon fontSize="0.50rem" sx={{ mr: 1}} />
          Export as PDF
        </MenuItem>
        <MenuItem 
        onClick={() => handleExport('excel')}
        sx={{ fontSize: '0.70rem', p:1 , mt:-1, mb:-1}}
        >
          <GridOnIcon fontSize="0.50rem" sx={{ mr: 1 }} />
          Export as Excel
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;
