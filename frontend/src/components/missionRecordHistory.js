import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import Exit from './exit_btn';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMissionDetails } from '../redux/slices/missionSlice';
import axiosInstance from '../utils/axiosConfig';

function MissionRecordData() {
  const [histories, setHistories] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.myMissions);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchApprovalData = async () => {
      if (missionDetails && missionDetails.length > 0) {
        const newMission = missionDetails.find(m => m.referenceId === id);
        if (newMission) {
          setHistories(newMission.missionHistoryRecords);
        }
      }
      try {
        const response = await axiosInstance.get(`/missionDetails/get-mission-history?referenceId=${id}`);
        setHistories(response.data.data);
      } catch (error) {
        console.error('Error fetching mission data:', error);
      }
    };

    if (id) {
      fetchApprovalData();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched && !loading && !error && (!missionDetails || missionDetails.length === 0)) {
        await dispatch(fetchMissionDetails());
      }
    };
  
    fetchData();
  }, [dispatch, hasFetched, loading, error, missionDetails]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure it's 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography sx={{ 
        fontSize: '0.75rem', 
        fontWeight: 'semibold', 
        mt: -2, 
        backgroundColor: '#5982b2', 
        p: 0.8, 
        textAlign: 'center', 
        borderRadius: '5px' ,
        color:'white'
      }}>
        MISSION RECORD HISTORY
      </Typography>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#575554' }}>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>SN</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>DATE</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>ACTION</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>USER</TableCell>
              <TableCell sx={{ color: 'white', fontSize: '0.60rem', 
                borderRight: '1px solid white', fontWeight: 'bold', padding: '2px 4px' }}>COMMENTS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {
                histories.length === 0 ?
                <TableRow>
                  <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px', textAlign: 'center' }} colSpan={5}>No records found</TableCell>
                </TableRow>
                :
                histories.map((history, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{formatDate(history.createdAt)}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{history.status.replaceAll('_', " ").toLowerCase()}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{history.performedBy.givenName+ " "+ history.performedBy.familyName}</TableCell>
                    <TableCell sx={{ fontSize: '0.60rem', padding: '2px 4px' }}>{history.comment}</TableCell>
                  </TableRow>
                ))
              }
          </TableBody>
        </Table>
      </TableContainer>

      {/* exit btn */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Exit />
      </Box>
    </Box>
  );
}

export default MissionRecordData;
