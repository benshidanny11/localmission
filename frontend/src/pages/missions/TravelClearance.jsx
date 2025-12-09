import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import TravelClearanceTable from '../../components/travelClearanceTable';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';


function TravelClearancePage() {

    const [id, setId] = useState('');
    const [missionDetail, setMissionDetail] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromQuery = queryParams.get('id') || '';
        setId(idFromQuery);
      }, [location.search]);

    useEffect(() => {
        const fetchData = async ()=> {
    
          try {
              const response = await axiosInstance.get(`/missionDetails/reference?referenceId=${id}`);
              let newMission = response.data;
              console.log(newMission);
              setMissionDetail(newMission);
    
          } catch (error) {
            console.error('Error fetching mission details:', error);
          }
    
        }

        if(id){
          fetchData();
        }

      }, [id]);
  return (
    <Box sx={{ display: 'flex' }} py={10} px={20}>
    <CssBaseline />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          { missionDetail !== null &&
            <TravelClearanceTable data={missionDetail}/>
          }
        </Box>
      </Box>
    </Box>
  );
}

export default TravelClearancePage;
