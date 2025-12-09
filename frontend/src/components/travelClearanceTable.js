import React, { useEffect, useState } from 'react';
import { Card, CardContent, Table, TableBody, TableRow, TableCell, Typography, Box } from '@mui/material';
import StampAndSignature from './stampSignature';
import axiosInstance from '../utils/axiosConfig';



const dataColumn = ['Issued to Mr/Mrs.', 'Title', 'Purpose of Mission', 'Expected Results', 'Who Proposed the Mission', 'Destination', 'Place and Date of Departure', 'Return Date', 'Mission Duration', 'Means of Transport', 'Mission Allowance', 'Transport/Mileage Allowance', 'Total Mission Amount'];


// Function to get current date, hour, and second
const getCurrentDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-GB', { // 'en-GB' formats date as day/month/year
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const time = now.toLocaleTimeString(); // Get the current time (hour, minute, second)
  return `${date} ${time}`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure it's 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
};

const TravelClearanceTable = ({data}) => {
  const [record, setRecord] = useState([]);
  const [date, setDate] = useState();
  const [jobTitle, setJobTitle] = useState('');

  useEffect(()=> {
    const formattedData = [
      `${data.employee.familyName.toUpperCase()} ${data.employee.givenName.toUpperCase()}`,  // Employee Name
      data.employee.jobtitle,  // Job Title
      data.purposeOfMission,  // Purpose of Mission
      data.expectedResults,  // Expected Results
      `${data.proposer.familyName.toUpperCase()} ${data.proposer.givenName.toUpperCase()}`,
      data.missionDestinations.map(dest => dest.district.districtName).sort().join(', '), 
      `${data.place}, ${formatDate(data.startDate)}`,  
      formatDate(data.endDate),
      `${data.missionDays} ${data.missionDays > 1 ? 'Days' : 'Day'}, ${data.missionNights} ${data.missionNights > 1 ? 'Nights' : 'Night'}`,
      `${data.transportMode.replaceAll("_", " ").toLowerCase()} ${data.transportMode === 'PRIVATE_CAR' ? '('+data.plate.toUpperCase()+')' : ''}`,
      `${data.missionAllowance ? data.missionAllowance.toLocaleString() : '-'} Rwf`,
      data.transportMileageAllowance !== null ? `${data.transportMileageAllowance.toLocaleString()} Rwf` : '-',
      data.totalAmount !== null ? `${data.totalAmount.toLocaleString()} Rwf` : '-'
    ];
    setRecord(formattedData);
    const approved = data.missionHistoryRecords.filter(record => record.status === "APPROVED").map(record => formatDate(record.createdAt));
    setDate(approved);
  }, [data]);

  useEffect(()=> {
    const fetchJObTitle = async () => {
      const response = await axiosInstance.get(`/employees/get-place?employeeId=${data.approver.employeeId}`);
          let jobTitle = response.data;
          setJobTitle(jobTitle.jobMaster.jobTitle);
    };

    if(data) {
      fetchJObTitle();
    }
  }, [data])

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardContent>
        {/* mission reference & creation date */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap:'17rem', mt:-2, mb:4}}>
        <Typography variant="body1" sx={{ color:'black', fontSize:'1rem', fontWeight: 'semiBold' }}>
          Mission Reference: {data.referenceId}
        </Typography>
        <Typography variant="body1"  sx={{  color:'black', fontSize:'1rem', fontWeight: 'semiBold' }}>
          Date: {formatDate(data.createdAt)}
        </Typography>
          </Box>

        {/* Title */}
        <Typography variant="h6" align="center" gutterBottom sx={{ fontSize: '2rem', marginTop: '5px', fontWeight: 'bold', mb: '5px' }}>
          Travel Clearance
        </Typography>


        {/* Table */}
        <Box sx={{ overflowX: 'auto', width: '75%', margin: 'auto', }}>
          <Table sx={{ minWidth: 300, mt:2  }}>
            <TableBody>
              {dataColumn.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ 
                    border: '0.5px solid gray', // Adds cell lines
                    fontSize: '0.80rem',
                    fontWeight: 'bold',
                    padding: '4px 8px', // Adjust padding to reduce the gap
                    minWidth: '200px', // Ensures cell width adapts to fit content
                    overflow: 'visible' // Makes sure content is visible
                  }}>
                    {item}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      border: '0.5px solid gray', // Adds cell lines
                      fontSize: '0.80rem',
                      padding: '4px 8px', // Adjust padding to reduce the gap
                      height: index === 2 || index === 3 ? '60px' : 'auto', // Increase height for rows 3 and 4
                      wordWrap: 'break-word', // Ensure long text wraps within cell
                      verticalAlign: 'top', // Align text to the top
                    }}
                  >
                    {record[index] || ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ 
          mt: 2,
          display: 'flex', 
          flexDirection: 'column', // Stack vertically
          alignItems: 'center', // Center items horizontally
        }}>

  {/* Container for text groups and vertical line */}
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', // Ensure it takes full width
    mt:4
  }}>
    {/* Group 1 */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      marginLeft: 10,
      marginTop:-15
    }}>
      <Typography sx={{ flexShrink: 0, fontSize: '0.80rem', color: 'black', mb: 2, mt:12 }}>Issued at Kigali on {formatDate(data.createdAt)}</Typography>
      
      
      {
        
        (!["SUBMITTED_FOR_APPROVAL", "MISSION_ORDER_RETURNED", "MISSION_ORDER_REJECTED", "MISSION_ORDER_CLEARANCE_RECORD_CANCELLED"].includes(data.status)) && (
          <>
            <Typography sx={{ flexShrink: 0, fontSize: '0.80rem', color: 'black', mb: 4,fontWeight: 'bold' }}>{`${data.approver.familyName} ${data.approver.givenName}`}</Typography>
            <StampAndSignature approver={data.approver} dateData={date} jobTitle={jobTitle}/>
          </>
        )
      }

    </Box>

    {/* Vertical Line */}
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        borderLeft: '2px solid black',
        height: '250px', // Adjust height to fit the tallest group of text
        // margin: '0 10rem', // Space between texts and line
        marginRight: 38,
        marginLeft: 4,
       
      }} 
    />

    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      marginTop:-10,
      
      
    }}>
      <Typography sx={{ flexShrink: 0, fontSize: '0.80rem', color: 'black',marginLeft: '-17rem' , mb: 4, mt:10,fontWeight: 'bold',}}>Visa of the Destination Institution (stamp & signature): </Typography>
      <Typography sx={{ flexShrink: 0, fontSize: '0.80rem', color: 'black',marginLeft: '-17rem', mb: 4 }}>Time & Date of Arrival: </Typography>
      <Typography sx={{ flexShrink: 0, fontSize: '0.80rem', color: 'black',marginLeft: '-17rem', mb: 4 }}>Time & Date of Departure:</Typography>
    </Box>
  </Box>
</Box>
     
    
      </CardContent>
      <Box>
     <Typography variant="p" sx={{marginLeft: 16, fontSize: 13}}>
      Printed on {getCurrentDateTime()}
    </Typography>
     </Box>
    </Card>
  );
};

export default TravelClearanceTable;
