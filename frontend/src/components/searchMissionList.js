import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchMissionList = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass the search term to the parent component
  };

  return (
    <div style={{ position: 'relative', minWidth: '200px' }}>
      <IconButton 
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '0',
          height: '24px',
          width: '24px',
          color: '#276b80',
        }} 
        aria-label="search"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{
          width: '100%',
          height: '30px',
          fontSize: '0.75rem',
          padding: '8px 8px 8px 40px',
          border: '1px solid #276b80',
          borderRadius: '4px',
          outline: 'none',
          boxShadow: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

export default SearchMissionList;
