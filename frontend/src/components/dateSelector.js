import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the date picker styles
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Import the calendar icon
import { Box, InputAdornment } from '@mui/material'; // Use Box and InputAdornment from MUI
import GenerateReport from './reportBtn'; // Assuming this is a custom component
import ExportButton from './exportPdfExcel';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const DateRangeSelector = ({ onGenerateReport, onExport }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startOption, setStartOption] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null); // Ref for the input

  const options = ["Commissioner General",
                    "Deputy Commissioner General",
                    "Customs Services",
                    "Domestic Taxes",
                    "Legal Services and Board Affairs",
                    "Internal Audit and Integrity",
                    "Strategic Intelligence and Investigation",
                    "Taxpayer Services and Communication",
                    "Single Project Implementation Unit",
                    "IT and Digital Transformation",
                    "Strategy and Risk Analysis",
                    "Finance",
                    "Human Resource",
                    "Administration and Logistics"
                  ];

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setStartOption(value);

    if (value) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered.length === 0 ? ["No Results"] : filtered);
    } else {
      setFilteredOptions(options); // Show all options if input is empty
    }
    setIsDropdownOpen(true);
  };
  

  const handleOptionClick = (option) => {
    setStartOption(option);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleInputClick = () => {
    setFilteredOptions(options); // Show all options initially when clicked
    setIsDropdownOpen(true); // Open the dropdown when input is clicked
  };

  // Validation function
  const validateInputs = () => {
    if (!startDate) {
      toast.error('Start date is required.');
      return false;
    }
    if (!endDate) {
      toast.error('End date is required.');
      return false;
    }
    if (!startOption) {
      toast.error('Department/Division is required.');
      return false;
    }
    return true;
  };

  // Custom handler for GenerateReport
  const handleGenerateReport = () => {
    if (validateInputs()) {
      // Proceed with report generation logic here
      onGenerateReport({ startDate, endDate, department: startOption });
    }
  };


    // Close dropdown if clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
            inputRef.current && !inputRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  return (
    <Box sx={{ padding: '10px', maxWidth: '700px' }}>
      {/* Toast Container for notifications */}
      <ToastContainer />

      {/* Horizontal Container */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Vertical Container for Date Inputs with Labels */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 2 }}>
          {/* Start Date Input with Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <label style={{ width: '55px', fontSize: '0.65rem', color: 'gray' }}>Start Date:</label>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Choose Start Date"
                dateFormat="dd/MM/yyyy"
                customInput={
                  <Box sx={{ position: 'relative' }}>
                    <input
                      value={formatDate(startDate)}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        width: '82%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '0.65rem',
                        height: '25px',
                      }}
                      placeholder="Choose Start Date"
                    />
                    <InputAdornment
                      position="end"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '30px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 14 }} />
                    </InputAdornment>
                  </Box>
                }
              />
            </Box>
          </Box>

          {/* End Date Input with Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <label style={{ width: '55px', fontSize: '0.65rem', color: 'gray' }}>End Date:</label>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Choose End Date"
                dateFormat="dd/MM/yyyy"
                minDate={startDate || today}
                customInput={
                  <Box sx={{ position: 'relative' }}>
                    <input
                      value={formatDate(endDate)}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        width: '82%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '0.65rem',
                        height: '25px',
                      }}
                      placeholder="Choose End Date"
                    />
                    <InputAdornment
                      position="end"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '30px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 14 }} />
                    </InputAdornment>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Box>

        {/* Department/Division Autocomplete */}
        <Box sx={{ flex: 1.5, display: 'flex', position: 'relative', flexDirection: 'column', mt: 1, gap: '0px' }}>
          <label style={{ width: '55px', fontSize: '0.65rem', color: 'gray', marginLeft: '-10rem' }}>
            Department/Division
          </label>
          <input
            ref={inputRef}
            value={startOption}
            onChange={handleInputChange}
            onClick={handleInputClick}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '0.65rem',
              height: '27px',
              marginLeft: '-10rem',
            }}
            placeholder="Select the Department/Division"
          />
          {isDropdownOpen &&  (
            <Box
              ref={dropdownRef}
              sx={{
                position: 'absolute',
                top: '100%',
                left: '-10rem',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {filteredOptions.map((option, index) => (
                <Box
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  sx={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }}
                >
                  {option}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Generate Report and Export Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '-3.9rem',
          ml: 12,
          width: '100%',
          gap: 2,
        }}
      >
        <GenerateReport onClick={handleGenerateReport} />
        <ExportButton onExport={onExport} />
      </Box>
    </Box>
  );
};

export default DateRangeSelector;
