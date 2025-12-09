import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, Alert, IconButton } from '@mui/material';
import CreateMissionPaymentBatch from './createPaymentBatch';
import FilterMissionList from './filterMissionList';
import SearchMissionList from './searchMissionList';
import FManageAction from './fmanage_btn';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaymentBatches } from '../redux/slices/missionComputationForPaymentBatchReducer';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function Payment() {
  const dispatch = useDispatch();
  const [filteredRows, setFilteredRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const handleSearch = (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filteredData = missionPaymentBatch.filter((row) =>
      row.sn.toLowerCase().includes(lowercasedTerm) ||
      row.description.toLowerCase().includes(lowercasedTerm) ||
      row.createdAt.toLowerCase().includes(lowercasedTerm) ||
      row.status.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredRows(filteredData);
  };

  const { missionPaymentBatch, loading, error, hasFetchedForMissionPayment } = useSelector(state => state.paymentBatchDetails);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetchedForMissionPayment) {
        await dispatch(fetchPaymentBatches());
      }
    };
    fetchData();
  }, [dispatch, hasFetchedForMissionPayment]);

  useEffect(() => {
    setFilteredRows(missionPaymentBatch);
  }, [missionPaymentBatch]);

  const handleFilter = (status) => {
    const filteredData = missionPaymentBatch.filter(row => row.status === status);
    setFilteredRows(filteredData);
    setPage(0); // Reset page to first when filtering
  };

  const handleReset = () => {
    setFilteredRows(missionPaymentBatch);
    setPage(0); // Reset page to first when resetting
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure it's 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to first when changing rows per page
  };

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pmt batch created':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 2 }}>
        MISSION PAYMENT LIST
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2, 
        gap: 2, // Adjust gap for spacing
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <SearchMissionList onSearch={handleSearch} />
          <FilterMissionList onFilter={handleFilter} onReset={handleReset} type={2} />
        </Box>
        <CreateMissionPaymentBatch />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#5982b2' }}>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>SN</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>Batch</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>Amount</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>Created On</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', padding: '2px 4px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                  Loading ...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                  <Alert severity="error">{error}</Alert>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.length > 0 ? (
                paginatedRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.sn}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{row.description}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{new Intl.NumberFormat().format(row.amount)} Rwf</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{formatDate(row.createdAt)}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', fontWeight:'bold', padding: '2px 4px', color: getStatusColor(row.status.replace(/_/g, ' ').toLowerCase()) }}>{row.status.replace(/_/g, ' ').toUpperCase()}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}><FManageAction row={row}/></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', padding: '2px 4px' }}>
                    <Alert severity="info">No mission payment batch found.</Alert>
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

export default Payment;
