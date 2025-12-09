import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, TablePagination, IconButton } from '@mui/material';
import FilterMissionList from './filterMissionList';
import SearchMissionList from './searchMissionList';
import ManageAction from './missionAllowanceBtn';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionDetails } from '../redux/slices/missionForComputationSlice';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function MissionAllowanceTable() {
  const dispatch = useDispatch();
  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.computationMissions);
  const [filteredRows, setFilteredRows] = useState([]);


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
      const employeeInfo = `${row.employee.employeeId} ${row.employee.givenName} ${row.employee.familyName}`.toLowerCase();
      const referenceId = row.referenceId.toLowerCase();
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
      case 'approved':
        return 'blue';
      case 'mission computed':
        return 'teal';
      case 'mission payment batch created':
          return '#1f8ef1';
      case 'reported':
          return 'lightgreen';
      case 'mission report accepted':
          return 'green';
      case 'claim submitted':
        return 'purple';
      default:
        return 'black';
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2 }}>
        MISSIONS ALLOWANCE COMPUTATION
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', gap: 5  }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchMissionList onSearch={handleSearch} />
          <FilterMissionList onFilter={handleFilter} onReset={handleReset} type={4}/>
        </Box>
      </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#5982b2' }}>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>SN</TableCell>
                {/* <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Staff id & Name</TableCell> */}
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Mission Reference</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Destination</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Start Date</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>End Date</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Mission Amount</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Transport Allowance</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontSize: '0.60rem', fontWeight: 'bold', padding: '2px 4px', borderRight: '1px solid white' }}>Action</TableCell>
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
                    {/* <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{`${row.employee.employeeId} - ${row.employee.givenName} ${row.employee.familyName}`}</TableCell> */}
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{`${row.employee.givenName} ${row.employee.familyName}`}</TableCell>
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
                    <TableCell sx={{ fontSize: '0.60rem', fontWeight:'bold', padding: '2px 4px', color: getStatusColor(row.status.replace(/_/g, ' ').toLowerCase()) }}>{row.status.replace(/_/g, ' ').toUpperCase()}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}><ManageAction  row={row} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: 'center', padding: '2px 4px' }}>
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
        rowsPerPageOptions={[5, 10, 15, 20]}
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

export default MissionAllowanceTable;
