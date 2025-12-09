import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, TablePagination, IconButton } from '@mui/material';
import FilterMissionList from './filterMissionList';
import SearchMissionList from './searchMissionList';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionDetails } from '../redux/slices/missionReports';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DateRangeSelector from './dateSelector';

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For exporting tables as PDF

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


function GenerateMissionReport() {
  const dispatch = useDispatch();
  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.missionReports);
  const [filteredRows, setFilteredRows] = useState([]);
  const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null, department: ''});

///table pagination
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched) {
        await dispatch(fetchMissionDetails());
      }
    };
  
    fetchData();
  }, [dispatch, hasFetched]);

  useEffect(() => {
    setFilteredRows(missionDetails);
  }, [missionDetails]);

  ///search functionality
  const handleSearch = (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    
    const filteredData = missionDetails.filter(row => {
      // Convert all relevant fields to lowercase for comparison
      // const employeeInfo = `${row.employee.employeeId} ${row.employee.familyName} ${row.employee.givenName}`.toLowerCase();
      const employeeInfo = `${row.employee.familyName} ${row.employee.givenName}`.toLowerCase();
      const referenceId = row.referenceId.toLowerCase();
      const department = row.employee.department.toLowerCase();
      const destinations = row.missionDestinations
        .map(dest => dest.district.districtName.toLowerCase())
        .join(' ');
      const status = row.status.replace(/_/g, ' ').toLowerCase();
      const startDate = row.startDate.toLowerCase();
      const endDate = row.endDate.toLowerCase();
      const missionAllowance = row.missionAllowance.toString().toLowerCase();
      const transportMileageAllowance = row.transportMileageAllowance == null ? '-' : row.transportMileageAllowance.toString().toLowerCase();
      
      // Check if the search term is included in any of the fields
      return employeeInfo.includes(lowercasedTerm) ||
             referenceId.includes(lowercasedTerm) ||
             department.includes(lowercasedTerm) ||
             destinations.includes(lowercasedTerm) ||
             status.includes(lowercasedTerm) ||
             startDate.includes(lowercasedTerm) ||
             endDate.includes(lowercasedTerm) ||
             missionAllowance.includes(lowercasedTerm) ||
             transportMileageAllowance.includes(lowercasedTerm);
    });
    
    setFilteredRows(filteredData);
  };

  const handleFilter = (status) => {
    const filteredData = missionDetails.filter(row => row.status.replace(/_/g, ' ').toLowerCase() === status.toLowerCase());
    setFilteredRows(filteredData);
  };

  const handleReset = () => {
    setFilteredRows(missionDetails);
  };

////rows change table
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure it's 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  // Function to map status to colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted for approval':
        return 'blue';
      case 'approved':
        return 'green';
      case 'mission order returned':
        return 'orange';
      case 'mission order rejected':
        return 'red';
      case 'mission order cancelled':
        return 'gray';
      case 'mission computed':
        return 'teal';
      case 'mission payment batch created':
        return '#1f8ef1';
      case 'mission payment batch cancelled':
        return 'darkgray';
      case 'reported':
        return 'lightgreen';
      case 'mission report accepted':
        return 'indigo';
      case 'mission claim':
        return 'purple';
      default:
        return 'black';
    }
  };

  /// 
  const handleGenerateReport = ({ startDate, endDate, department }) => {
    const filteredData = missionDetails.filter(row => {
      const missionStartDate = new Date(row.startDate);
      const missionEndDate = new Date(row.endDate);
      
      const isWithinDateRange = (!startDate || missionStartDate >= startDate) && (!endDate || missionEndDate <= endDate);
  
      const isMatchingDepartment = !department || 
      (row.employee.department && row.employee.department.toLowerCase() === department.toLowerCase()); // Check department inside employee
      
      return isWithinDateRange && isMatchingDepartment;
    });
  
    setFilteredRows(filteredData);
  };

  //export pdf or excel

  const handleExport = (format) => {
    if(format === 'pdf') {
      exportAsPDF();
    } else if (format === 'excel') {
      exportAsExcel();
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape', // Set the page in landscape mode for wider width
      unit: 'mm',               // Set the unit to millimeters
      format: [400, 210]        // Custom size: 400mm width, 210mm height (A4 height)
    });
    doc.text('Mission Report', 20, 10);

    doc.autoTable({
      // head: [['SN','Staff ID & Name', 'Title', 'Department', 'Mission Reference ID', 'Destination', 'Start Date', 'End Date', 'Mission Amount', 'Transport/Mileage', 'Mission Amount Claimed', 'Status']],
      head: [['SN','Name', 'Title', 'Department', 'Mission Reference ID', 'Destination', 'Start Date', 'End Date', 'Mission Amount', 'Transport/Mileage', 'Mission Amount Claimed', 'Status']],
      body: paginatedRows.map((row, index) => [
        index+1,
        `${row.employee.familyName} ${row.employee.givenName}`,
        row.employee.jobtitle !== null ? row.employee.jobtitle : '',
        row.employee.department !== null ? row.employee.department : '',
        row.referenceId,
        row.missionDestinations.map((dest) => dest.district.districtName).join(', '),
        formatDate(row.startDate),
        formatDate(row.endDate),
        `${row.missionAllowance.toLocaleString()} Rwf`,
        `${row.transportMileageAllowance !== null ? row.transportMileageAllowance.toLocaleString() + ' Rwf' : ''}`,
        `${row.claimAmount !== null ? row.claimAmount.toLocaleString() + ' Rwf' : '-'}`,
        row.status.replace(/_/g, ' '),
      ]),
    });

    doc.save('Mission_Report.pdf');
  };

  const exportAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mission Report');
  
    // Define the columns with headers
    worksheet.columns = [
      // { header: 'Staff ID - Name', key: 'staff', width: 30 },
      { header: 'Name', key: 'staff', width: 30 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Department', key: 'department', width: 30 },
      { header: 'Mission Reference ID', key: 'missionRefId', width: 20 },
      { header: 'Destination', key: 'destination', width: 40 },
      { header: 'Start Date', key: 'startDate', width: 15 },
      { header: 'End Date', key: 'endDate', width: 15 },
      { header: 'Mission Amount', key: 'missionAmount', width: 15 },
      { header: 'Transport/Mileage', key: 'transportMileage', width: 20 },
      { header: 'Mission Amount Claimed', key: 'missionAmountClaimed', width: 20 },
      { header: 'Status', key: 'status', width: 30 },
    ];
  
    // Add rows to the worksheet
    paginatedRows.forEach((row) => {
      worksheet.addRow({
        // staff: `${row.employee.employeeId} - ${row.employee.familyName} ${row.employee.givenName}`,
        staff: `${row.employee.familyName} ${row.employee.givenName}`,
        title: row.employee.jobtitle !== null ? row.employee.jobtitle : '', // Add relevant title data if needed
        department: row.employee.department !== null ? row.employee.department : '', // Add relevant department data if needed
        missionRefId: row.referenceId,
        destination: row.missionDestinations.map((dest) => dest.district.districtName).join(', '),
        startDate: formatDate(row.startDate),
        endDate: formatDate(row.endDate),
        missionAmount: `${row.missionAllowance.toLocaleString()} Rwf`,
        transportMileage: `${row.transportMileageAllowance !== null ? row.transportMileageAllowance.toLocaleString() + ' Rwf' : ''}`,
        missionAmountClaimed: `${row.claimAmount !== null ? row.claimAmount.toLocaleString() + ' Rwf' : ''}`, // Add relevant mission claimed data if needed
        status: row.status.replace(/_/g, ' '),
      });
    });
  
    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Bold white text
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }, // Dark blue background
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
    // Style the rest of the rows with borders and alignment
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
      }
    });
  
    // Write the file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Mission_Report.xlsx');
  };
  
  

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      {/* Typography */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontSize: '1rem', 
          fontWeight: 'bold',
          marginRight: 'auto' // Pushes the Typography to the left
        }}
      >
        GENERATE MISSIONS REPORT
      </Typography>

      {/* Box with Search and Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <SearchMissionList onSearch={handleSearch} />
        <FilterMissionList onFilter={handleFilter} onReset={handleReset} type={3} />
      </Box>
    </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap:5, mt:-2, mb:2}}>
      <Box sx={{ width:'805px', border: '1px solid #ccc', mt :2, borderRadius: '5px', p:0.8}}>
          <DateRangeSelector  onGenerateReport={handleGenerateReport} onExport={handleExport} />
        </Box>
      </Box>

      
       
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#5982b2' }}>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>SN</TableCell>
                {/* <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Staff id & Name</TableCell> */}
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Department</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Mission Reference</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Destination</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Start Date</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>End Date</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Mission Amount</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Transport/Mileage</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Mission Amount Claimed</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                  Loading ...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : (
            paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{index + 1 + page * rowsPerPage}</TableCell>
                    {/* <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{`${row.employee.employeeId} - ${row.employee.familyName} ${row.employee.givenName}`}</TableCell> */}
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{`${row.employee.familyName} ${row.employee.givenName}`}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.jobtitle !== null ? row.employee.jobtitle : ''}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.employee.department !== null ? row.employee.department : ''}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.referenceId}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                      {row.missionDestinations.map(dest => dest.district.districtName).join(', ')}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{formatDate(row.startDate)}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{formatDate(row.endDate)}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>
                      {new Intl.NumberFormat().format(row.missionAllowance)} Rwf
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.transportMileageAllowance == null ? '-' : `${new Intl.NumberFormat().format(row.transportMileageAllowance)} Rwf`}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.claimAmount !== null ? row.claimAmount.toLocaleString() + ' Rwf' : '-'}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', fontWeight:'bold', padding: '2px 4px', color: getStatusColor(row.status.replace(/_/g, ' ').toLowerCase()) }}>{row.status.replace(/_/g, ' ').toUpperCase()}</TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                    <Alert severity="info">No missions found.</Alert>
                  </TableCell>
              </TableRow>
              )
            )}
            </TableBody>
          </Table>
        </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20,100, 500, 1000]}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.65rem',
          },
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'center',
            minHeight: 'auto', // Adjust if needed for alignment
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.65rem',
          },
          '& .MuiTablePagination-actions': {
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
          },
        }}
        ActionsComponent={(props) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={(event) => props.onPageChange(event, props.page - 1)}
              disabled={props.page === 0}
              sx={{ fontSize: '0.65rem' }}
            >
              <NavigateBeforeIcon />
              <Typography variant="caption" sx={{ mx: 1 }}>
              Prev
            </Typography>
            </IconButton>
            <IconButton
              onClick={(event) => props.onPageChange(event, props.page + 1)}
              disabled={props.page >= Math.ceil(props.count / props.rowsPerPage) - 1}
              sx={{ fontSize: '0.65rem' }}
            >
               <Typography variant="caption" sx={{ mx: 1 }}>
              Next
            </Typography>
              <NavigateNextIcon />
              
            </IconButton>
          </Box>
        )}
        />
      </Box>
    </Box>
  );
}

export default GenerateMissionReport;
