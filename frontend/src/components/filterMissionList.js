import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const statuses = [
  'submitted for approval',
  'approved',
  'mission order returned',
  'mission order rejected',
  'mission order clearance record cancelled',
  'mission computed',
  'mission payment batch created',
  'reported',
  'mission report accepted',
  'claim submitted'
];

const statusesForApprover = [
  'submitted for approval',
  'approved',
  'mission order clearance record cancelled',
  'mission computed',
  'mission payment batch created',
  'reported',
  'mission report accepted',
  'claim submitted'
];



const statusesForPaymentBatch = [
  'pmt batch created',
  'cancelled'
];

const statusesForFinance = [
  'approved',
  'mission computed',
  'mission payment batch created',
  'reported',
  'mission report accepted',
  'claim submitted'
];

const FilterMissionList = ({ onFilter, onReset, type }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (status) => {
    setAnchorEl(null);
    if (status === null) {
      onReset(); // Call the reset function to show all data
    } else {
      onFilter(status);
    }
  };

  return (
    <>
      <Button
        startIcon={<FilterListIcon />}
        variant="outlined"
        sx={{
          height: 30,
          width: '8rem',
          fontSize: '0.75rem',
          padding: '4px 12px',
          textTransform: 'none',
        }}
        onClick={handleClick}
      >
        Status Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
        sx={{
          '& .MuiPaper-root': {
            width: 180, // Adjust dropdown width
            mt: 0.6,
          },
        }}
      >
        <MenuItem
          onClick={() => handleClose(null)} // Reset to show all statuses
          sx={{
            fontSize: '0.65rem', // Reduce font size
            padding: '2px 8px',   // Adjust padding to reduce height
            fontWeight: 'bold',
            color: 'darkred'
          }}
        >
          Reset All
        </MenuItem>
        {
           (type === 1 ? statuses : type === 2 ? statusesForPaymentBatch : type === 3 ? statusesForApprover : statusesForFinance).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleClose(status)}
            sx={{
              fontSize: '0.65rem', // Reduce font size
              padding: '2px 8px',   // Adjust padding to reduce height
            }}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterMissionList;
