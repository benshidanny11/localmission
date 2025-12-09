import React, { useState, useEffect, useRef } from 'react';
import '../assets/css/missionForm.css';
import '@mantine/core/styles.css';
import Notification from '../components/toastNotification'; // Import the Notification component
import dayjs from 'dayjs';
import { DateInput } from '@mantine/dates';
import { Select } from '@mantine/core';
import '@mantine/dates/styles.css';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';
import '@fontsource-variable/nunito-sans';
import { Box, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';
import { useSelector, useDispatch } from 'react-redux';
import { resubmitMissionDetails } from '../redux/slices/missionSlice';
import { useNavigate } from 'react-router-dom';
import { Modal,List } from '@mantine/core';
import { fetchEmployees } from '../redux/slices/employeeSlice';
import DestinationTable from './destinationTable';
import { useLocation } from 'react-router-dom';
import { fetchMissionDetails } from '../redux/slices/missionSlice';
import {CircularProgress, Alert } from '@mui/material';
import axios from 'axios';


async function getFileFromBlobUrl(blobUrl, fileName) {
  // Fetch the blob from the blob URL
  const response = await fetch(blobUrl);

  // Get the blob from the response
  const blob = await response.blob();

  // Create a new File object using the blob
  const file = new File([blob], fileName, { type: blob.type });

  return file;
}


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

function formatString(input) {
  if(input === "RRA_VEHICLE"){
    return "RRA Vehicle";
  }
  return input
    .toLowerCase()                        // Convert to lowercase
    .split('_')                           // Split by underscore
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                           // Join with spaces
}



function MissionForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { grade } = useSelector(state => state.user);
  const { missionDetails, hasFetched, loading, error } = useSelector(state => state.myMissions);

  const [referenceId, setReferenceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedResults, setExpectedResults] = useState('');

  const [proposerId, setProposerId] = useState('');
  const [approvedId, setApprovedId] = useState('');

  const [place, setPlace] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState('');

  const [missionDuration, setMissionDuration] = useState('');
  const [transport, setTransport] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [missionAllowance, setMissionAllowance] = useState('');
  const [locations, setLocations] = useState([{ location: '', dateFrom: '', dateTo: '', days: '', nights: '' }]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  
  const [employeeMinData, setEmployeeMinData] = useState([]);
  const [district, setDistrict] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [allowade, setAllowade] = useState([]);
  const [allowadeGrade, setAllowadeGrade] = useState('');
  const [defaultProposer, setDefaultProposer] = useState('');
  const [defaultApprover, setDefaultApprover] = useState('');
  const [urls, setUrls] = useState([]);
  const [reason, setReason] = useState('');
  const [initialMissionAllowance, setInitialMissionAllowance] = useState('');


  const { employees } = useSelector(state => state.employees);


  const location = useLocation();
  const [id, setId] = useState('');
  const [missionDetail, setMissionDetail] = useState(null);

  const allowedgrades = [
    "E3",
    "E2",
    "E1",
    "M3",
  ];

  useEffect(() => {
    setAllowadeGrade(grade);
  }, [grade]);

  useEffect(() => {
    if (allowedgrades.includes(allowadeGrade)) {
      setAllowade(['Private Car','RRA Vehicle','Hired Car', 'Transport Sponsor']);
    } else {
      setAllowade(['Public Car','RRA Vehicle','Hired Car', 'Transport Sponsor']);
    }
  }, [allowadeGrade, staffId]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    const downloadFiles = async () => {
      try {
        const filePromises = urls.map(async (url) => {
          // Make a request to get the file
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/files/${url}`, { responseType: 'blob' });
  
          // Create a Blob object from the response data
          const blob = new Blob([response.data], { type: 'application/pdf' });
  
          // Create a File object from the Blob
          const file = new File([blob], url.split('/').pop(), { type: 'application/pdf' });
  
          return {
            name: file.name, // File name
            file, // The File object
            blobURL: URL.createObjectURL(file), // URL for the File object
          };
        });
  
        const downloadedFiles = await Promise.all(filePromises);
  
        // Convert blob URLs to File objects
        const filesWithFiles = await Promise.all(
          downloadedFiles.map(async ({ blobURL, name }) => await getFileFromBlobUrl(blobURL, name))
        );
  
        setFiles(filesWithFiles);
  
        return () => {
          downloadedFiles.forEach(({ blobURL }) => URL.revokeObjectURL(blobURL));
        };
      } catch (error) {
        console.error('Error downloading files', error);
      }
    };
  
    if (urls.length > 0) {
      downloadFiles();
    }
  }, [urls]);
  

  useEffect(() => {
    const fetchData = async ()=> {

      try {
          
          const newMission = missionDetails.find(m => m.referenceId === id);
          // const response = await axiosInstance.get(`/missionDetails/reference?referenceId=${id}`);
          // let newMission = response.data;
          if (newMission) {
            const { employeeId, givenName, familyName, jobtitle, department } = newMission.employee;
            const extractedDataApprover = `${newMission.approver.givenName} ${newMission.approver.familyName}`;
            const extractedDataProposer = `${newMission.proposer.givenName} ${newMission.proposer.familyName}`;
            const extractedData = `${givenName} ${familyName}`;
            setPlace(newMission.place);
            setReferenceId(newMission.referenceId)
            setStaffId(employeeId)
            setStaffName(extractedData)
            setTitle(jobtitle);
            setDepartment(department);
            setPurpose(newMission.purposeOfMission);
            setExpectedResults(newMission.expectedResults);
            setProposerId(newMission.proposer.employeeId);
            setApprovedId(newMission.approver.employeeId);
            setDefaultApprover(extractedDataApprover);
            setDefaultProposer(extractedDataProposer);
            setDepartureDate(newMission.startDate);
            setCurrentDate(newMission.createdAt);
            setMissionAllowance(newMission.missionAllowance);
            setInitialMissionAllowance(newMission.missionAllowance);
            setReason(newMission.weekendReason);
    
            const locationsNew = newMission.missionDestinations.map((destination, index) => {
              const {district, startDate, endDate, numberOfDays, numberOfNights } = destination;
              return { location: district.districtName, dateFrom: new Date(startDate + 'T00:00:00+02:00'), dateTo: new Date(endDate + 'T00:00:00+02:00'), days: numberOfDays, nights: numberOfNights }
            });
            setLocations(locationsNew);
    
            
    
            const data = newMission.missionDestinations.map(destination => ({
              districtId: destination.district.districtCode,
              startDate: destination.startDate ? formatDate(destination.startDate) : '',
              endDate: destination.endDate ? formatDate(destination.endDate) : '',
              numberOfDays: destination.numberOfDays,
              numberOfNights: destination.numberOfNights
            }));
            setDestinations(data);
    
            setTransport(formatString(newMission.transportMode));
            setPlateNumber(newMission.plate);
            setReturnDate(dayjs(new Date(newMission.endDate)));
            setMissionDuration(`${newMission.missionDays} days, ${newMission.missionNights} nights`);
            setIsDisabled(newMission.status !== "MISSION_ORDER_RETURNED");
            
          
            setUrls(newMission.missionFiles.filter((file)=> file.missionDocType === "SUPPORT").map((file) =>file.missionFile));
            setMissionDetail(newMission);
            
          }

          console.log(missionDetail)

      } catch (error) {
        console.error('Error fetching mission details:', error);
      }

    }
    if(id){
      fetchData();
    }
  }, [id, missionDetails]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched) {
        await dispatch(fetchMissionDetails());
      }
    };
    fetchData();
  }, [dispatch, hasFetched]);

  useEffect(() => {
    const fetchData = async () => {
      if (!employees || employees.length === 0) {
        await dispatch(fetchEmployees());
      }
    };

    fetchData();
  
  }, [dispatch, employees]);


  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const response = await axiosInstance.get(`/employees/proposers`);
        const data = response.data;
      
      const transformedArray = data.map(employee => `${employee.employeeId} - ${employee.givenName} ${employee.familyName}`);
        setEmployeeMinData(transformedArray);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchApprovalData();
  }, [defaultProposer]);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axiosInstance.get(`/districts`);
        const data = response.data;
        const transformedArray = data.map(district => `${district.districtName}`);
        setDistrict(transformedArray);
        setDistrictData(data);
      } catch (error) {
        console.error('Error fetching district data:', error);
      }
    };

    fetchDestination();
  }, []);

  useEffect(()=> {
    const getMissionAllowance = async () => {
      try {
        if(true) {
  
          const updatedDestinations = destinations.map(destination => ({
            districtId: destination.districtId,
            numberOfDays: destination.numberOfDays,
            numberOfNights: districtData.filter(dist => dist.districtCode === destination.districtId)[0].districtName !== place ? destination.numberOfNights : 0
          }));
  
          const sendData = {
            employeeId: staffId.split(' - ')[0].split(' ')[0],
            missionAllowance: updatedDestinations,
          }
          
          const response = await axiosInstance.post(`/mission-allowance/calculate`, sendData);
          const data = response.data;
          setMissionAllowance(data.data.amount);
        }
        
      } catch (error) {
        console.error('Error fetching missionAllowance data:', error);
      }
    };

    getMissionAllowance();
  }, [destinations, staffId, departureDate]);

  

  const handleAddRow = () => {
    const lastRow = locations[locations.length - 1];
  
    // Validate that the last row has required data before adding a new row
    if (!lastRow.location || !lastRow.dateFrom || !lastRow.dateTo) {
      setNotification({message:'Please fill out the last row completely before adding a new one.',type:'error'});
      return;
    }
  
    // Set the new row's dateFrom to the previous row's dateTo
    const newRow = {
      location: '',
      dateFrom: lastRow.dateTo || '', // Use lastRow's dateTo as the new row's dateFrom
      dateTo: '',
      days: '',
      nights: ''
    };
  
    setLocations([...locations, newRow]);
  };
  
  

  const handleLocationChange = (index, field, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
  
    // Handle auto-generation for the first row's dateFrom when the departure date is set
    if (field === 'departureDate' && index === 0) {
      updatedLocations[0].dateFrom = value;
    }
  
    // Ensure dateTo is not earlier than dateFrom
    if (field === 'dateTo') {
      const dateFrom = updatedLocations[index].dateFrom;
      if (dateFrom && dayjs(value).isBefore(dayjs(dateFrom))) {
        setNotification({ message: 'Date To cannot be earlier than Date From', type: 'error' });
        return;  // Stop execution if dateTo is invalid
      }
    }
  
    // Recalculate days and nights
    if (field === 'dateFrom' || field === 'dateTo') {
      const { dateFrom, dateTo } = updatedLocations[index];
      if (dateFrom && dateTo) {
        const fromDate = dayjs(dateFrom);
        const toDate = dayjs(dateTo);
  
        // Calculate days and nights
        const daysSpent = toDate.diff(fromDate, 'day') + 1;
        const nightsSpent = toDate.diff(fromDate, 'day');
  
        updatedLocations[index] = {
          ...updatedLocations[index],
          days: daysSpent,
          nights: nightsSpent,
        };
      }
  
      // Auto-set the next row's dateFrom based on the current row's dateTo
      if (index < updatedLocations.length - 1 && field === 'dateTo') {
        const nextRow = updatedLocations[index + 1];
        if (!nextRow.dateFrom && value) {
          updatedLocations[index + 1].dateFrom = value;
        }
      }
    }
  
    // Update state and mission duration
    setLocations(updatedLocations);
    calculateMissionDuration(updatedLocations);
  
    // Find the latest dateTo and set it as returnDate
    const latestDateTo = updatedLocations.reduce((latest, loc) => {
      if (loc.dateTo && (!latest || dayjs(loc.dateTo).isAfter(dayjs(latest)))) {
        return loc.dateTo;
      }
      return latest;
    }, null);
  
    if (latestDateTo) {
      setReturnDate(latestDateTo);
    }
  
    // Format the data for destinations
    const data = updatedLocations.map(destination => ({
      districtId: destination.location
        ? districtData.filter(dist => dist.districtName === destination.location)[0].districtCode
        : '',
      startDate: destination.dateFrom ? formatDate(destination.dateFrom) : '',
      endDate: destination.dateTo ? formatDate(destination.dateTo) : '',
      numberOfDays: destination.days,
      numberOfNights: destination.location !== place ? destination.nights : 0,
    }));
  
    setDestinations(data);
  };

  const validateDates = (index, field, value) => {
    const currentLocation = locations[index];
    let newLocations = [...locations];
    newLocations[index] = { ...currentLocation, [field]: value };

    const { dateFrom, dateTo } = newLocations[index];

    if (index === 0) {
      if (dateTo && dateFrom && dayjs(dateTo).isBefore(dateFrom)) {
        setNotification({message:'Date To cannot be earlier than Date From in the first row.' , type:'error'});
        return false;
      }
    } else {
      // For other rows, Date To must be later than Date From
      if (dateTo && dateFrom && !dayjs(dateTo).isAfter(dateFrom)) {
        setNotification({message:'Dates cannot match for second location!', type:'error'});
        return false;
      }
    }
    return true;
  };

  const handleDateChange = (index, field, value) => {
    // Ensure that value is always a valid date or empty
    const parsedValue = dayjs(value).isValid() ? dayjs(value).toDate() : null;
    
    if (validateDates(index, field, parsedValue)) {
      handleLocationChange(index, field, parsedValue);
    }
  };
  

  const handlePlaceChange = (value) => {
    setPlace(value);
    console.log("place is:", value)
  };
  
  const calculateMissionDuration = (locations, place) => {
    console.log("Place of departure:", place);
    
    let totalDays = 0;
    let totalNights = 0;
    
    for (let i = 0; i < locations.length; i++) {
        const { location, dateFrom, dateTo } = locations[i];
        
        if (dateFrom && dateTo) {
            const fromDate = dayjs(dateFrom);
            const toDate = dayjs(dateTo);
            
            // Calculate total days including the last day
            let daysSpent = toDate.diff(fromDate, 'day') + 1;
            
            // Initialize nights to 0
            let nightsSpent = 0;
            
            // If the location is different from the place of departure, calculate nights
            if (location !== place) {
                nightsSpent = toDate.diff(fromDate, 'day');
            } else {
                console.log(`Returning home each day from location: "${location}". Nights set to 0.`);
            }
            
            // Ensure the days calculation accounts for overlap with previous location
            if (i > 0) {
                const prevDateTo = dayjs(locations[i - 1].dateTo);
                if (fromDate.isSame(prevDateTo, 'day')) {
                    daysSpent -= 1; // Subtract 1 day for overlap
                }
            }
            
            // Store the calculated days and nights in the location object
            locations[i] = {
                ...locations[i],
                days: daysSpent,
                nights: nightsSpent,
            };
            
            // Add to totals
            totalDays += daysSpent;
            totalNights += nightsSpent;
        }
    }
    
    // Update mission duration state with total days and nights
    setMissionDuration(`${totalDays} days, ${totalNights} nights`);
    
    console.log("Updated locations:", locations); // Debug to ensure the values are correct
    return locations; // Return updated locations
};
useEffect(() => {
  if (place) {
    calculateMissionDuration(locations, place);
  }
}, [place, locations]); // Trigger when either place or locations change



  //FORM SUBMIT
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!staffId) {
      setNotification({ message: 'Staff ID is required!', type: 'error' });
      return;
    }

    if (!staffName) {
      setNotification({ message: 'staff Name is required!', type: 'error' });
      return;
    }

    if (!purpose) {
      setNotification({ message: 'Purpose is required!', type: 'error' });
      return;
    }

    if (!expectedResults) {
      setNotification({ message: 'Expected Results is required!', type: 'error' });
      return;
    }

    if (!proposerId) {
      setNotification({ message: 'Proposer Id is required!', type: 'error' });
      return;
    }

    if (!approvedId) {
      setNotification({ message: 'Approved Id is required!', type: 'error' });
      return;
    }

    if (!place) {
      setNotification({ message: 'Place of Departure is required!', type: 'error' });
      return;
    }

    if (!departureDate) {
      setNotification({ message: 'Departure Date is required!', type: 'error' });
      return;
    }

    if (!validateForm()) {
      setNotification({message:'The Destination Table is not complete!', type:'error'});
      return;
    }

    if (!returnDate) {
      setNotification({ message: 'Return Date is required!', type: 'error' });
      return;
    }

    if (!transport) {
      setNotification({ message: 'Transport is required!', type: 'error' });
      return;
    }

    if (files.length < 1) {
      setNotification({ message: 'Support document is required!', type: 'error' });
      return;
    }

    if(transport) {
      if (allowedgrades.includes(grade) && !(transport === 'Private Car' || transport === 'Hired Car' || transport === 'RRA Vehicle' || transport === 'Transport Sponsor')) {
          setNotification({ message: 'You are required to use a Private Car, Hired Car, Transport Sponsor and RRA Vehicle.', type: 'error' });
          return;
      } 
      if((transport === 'Private Car') && !plateNumber) {
        setNotification({ message: 'Plate number is required!', type: 'error' });
        return;
      }

      if(plateNumber  && plateNumber.length !== 7) {
        setNotification({ message: "Plate number should be in the format 'RAA123A'.", type: 'error' });
        return;
      }
    }

    const mssnDuration = missionDuration.match(/\d+/g).map(Number);

    const missionDetail = {
      employeeId: staffId.split(' - ')[0].split(' ')[0],
      purposeOfMission: purpose,
      expectedResults: expectedResults,
      proposerId: proposerId.split(' - ')[0].split(' ')[0],
      approverId: approvedId,
      place: place,
      startDate: formatDate(departureDate),
      endDate: formatDate(returnDate),
      missionDays: mssnDuration[0],
      missionNights: mssnDuration[1],
      transportMode: transport.toUpperCase().replace(' ', '_'),
      plate: (transport === 'Private Car') ? plateNumber : undefined,
      missionAllowance: missionAllowance,
      missionDestinations: destinations
    };

    const formData = new FormData();
    formData.append('missionDetail', JSON.stringify(missionDetail));
    files.forEach(file => {
      formData.append('missionFiles', file);
    });

    dispatch(resubmitMissionDetails({referenceId: referenceId, missionData: formData}))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission resubmitted successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/my-missions");
      }, 3000);
    })
    .catch((error) => {
      setNotification({ message: error["message"], type: 'error' });
    });

  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDepartureDate(today);
  }, []);
  
  const handleTransportChange = (value) => {
    setTransport(value);
  };
  
  const handleUploadClick = (e) => {
    e.preventDefault();
    if (files.length >= 2) {
      setNotification({ message: 'Only 2 documents can be uploaded!', type: 'error' });
    } else {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setNotification({ message: 'Only PDF files are allowed!', type: 'error' });
      e.target.value = '';
    } else if (selectedFile) {
      setFiles((prevFiles) => [...prevFiles, selectedFile]);
      fileInputRef.current.value = '';
    }
  };
  
  const openModal = (actionType) => {
    setAction(actionType);
    setShowModal(true);
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
    if (action === 'view') {
      const file = files[index];
      if (file && file.url) {
        console.log(file.url); // Copy this URL and paste it in a new browser tab to check
      window.open(file.url, '_blank');
    } else {
      window.open(URL.createObjectURL(files[index]));
    }
    setShowModal(false);
    } else if (action === 'delete') {
      setShowConfirmModal(true);
    }
  };
  

  const handleDeleteConfirm = () => {
    if (files.length === 2) {
      setFiles(files.filter((_, i) => i !== selectedIndex));
    } else if (files.length === 1) {
      setFiles([]);
    }
    setShowConfirmModal(false);
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowConfirmModal(false);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    setAction('view');
    openModal('view');
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setAction('delete');
    openModal('delete');
  };

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);

  //CANCEL FORM SUBMISSION
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleCancelClick = () => {
    setConfirmationOpen(true); // Open the confirmation dialog
  };

  const handleConfirmationClose = (confirmed) => {
    setConfirmationOpen(false); // Close the confirmation dialog

    if (confirmed) {
      // Handle the cancellation logic
      navigate("/my-missions");
      console.log("User confirmed cancellation.");
    } else {
      console.log("User canceled the cancellation.");
    }
  };
  
  const handlePlateNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 7) {
      setPlateNumber(value);
    }
  };
  
  const deleteAllRows = () => {
    setLocations((prevLocations) => {
      if (prevLocations.length > 1) {
        const updatedLocations = prevLocations.slice(0, -1);
        updatedLocations[updatedLocations.length - 1].dateTo = ''; // Clear `dateTo` of the previous row
        return updatedLocations;
      } else {
        return [{
          location: prevLocations[0]?.location || '',
          dateFrom: prevLocations[0]?.dateFrom || '',
          dateTo: '', // Clear `dateTo`
          days: 0,
          nights: 0
        }];
      }
    });
  
    setReturnDate('');
    setMissionDuration('');
    setMissionAllowance('');
  };

  const validateForm = () => {
    for (let location of locations) {
      if (!location.location || !location.dateFrom || !location.dateTo || !location.days) {
        return false;
      }
  
      // If nights is null or undefined, treat it as 0
      if (location.nights == null) {
        location.nights = 0;
      }
    }
    return true;
  };
  
  
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }


  // (Rest of the component remains the same)

  return (
    <div className="container">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      {missionDetail ? (
       <>
       <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%', // Ensure the Box takes the full width
            borderBottom: '2px solid transparent',
            borderImage: 'linear-gradient(to right, #276b80 0%, #276b80 33%, #228b22 33%, #228b22 66%, #ffa500 66%, #ffa500 100%) 1', // Gradient border
            paddingBottom: '0px', // Adjust padding if needed
            justifyContent: 'space-between',
          }}
        >
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 5,
              flexGrow: 1, // Make sure this Box takes up the remaining space
              mb:1
            }}
          >
            <img 
              src="Assets/bg_rra_logo.png" 
              style={{ width: 70, height: 'auto', marginRight: 8, marginBottom: 0 }} 
              alt="Logo"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#276b80' }}>
                  RWANDA REVENUE AUTHORITY
              </Typography>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold', fontSize: '0.65rem', color: '#276b80', mt:-0.8 }}>
                  TAXES FOR GROWTH AND DEVELOPMENT
              </Typography>
          </Box>
        </Box>
        
        <Typography 
          variant="subtitle2"  // Reduced font size
          component="div" 
          sx={{ 
            mb:1,
            fontWeight: 'bold', 
            color: 'green', // Make the text red
            position: 'relative', 
            marginLeft: 'auto', 
            marginRight: 5,
            transform: 'rotate(0deg)', // Tilt the text slightly
            fontSize: '1rem', // Reduce the font size of "INTERNAL"
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              left:0,
              right: 0,
              height: '2px',
              backgroundColor: 'green', // Red border color
            },
            '&::before': {
              top: '-1px', // Adjusted position for the top line
            },
            '&::after': {
              bottom: '-1px', // Adjusted position for the bottom line
            },
          }}
        >
          INTERNAL
        </Typography>
      </Box>

      <div className="form-container">
        <div className="LabelTop">
          <label htmlFor="reference">Reference: </label>
          <Input type="text" id="reference" className="reference_input" value={missionDetail.referenceId} readOnly />
        </div>

        <div className="LabelTop">
          <label htmlFor="date" className="date-field">Date: </label>
          <Input type="date" id="date" className="date_input" value={missionDetail.createdAt.split('T')[0]} readOnly />
        </div>
      </div>

      <div className="headercontainer">
        <h1 className="head1">Travel Clearance</h1>
      </div>
        
      <div className="Staff1">
        {/* <div className="Labels">
          <label htmlFor="staff-id">Staff ID</label>
          <Input
            type="text"
            id="staff-id"
            className="Staff-id"
            placeholder="Staff ID"
            value={staffId}
            onChange={(value) => setStaffId(value)}
            readOnly
            nothingFoundMessage="Nothing found..."
          />
        </div> */}
      </div>

      <div className="container1">
        <div className="Labels">
          <label htmlFor="name">Staff Names</label>
          <Input
            type="text"
            id="name"
            className="staff-name"
            placeholder="Staff Names"
            value={staffName}
            onChange={(value) => setStaffName(value)}
            readOnly
          />
        </div>
        <div className="Labels">
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            className="title-name"
            placeholder="Staff Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly
          />
        </div>
        <div className="Labels">
          <label htmlFor="department">Department</label>
          <Input
            type="text"
            id="department"
            className="depart-name"
            placeholder="Department/Division"
            value={department}
            onChange={(value) => setDepartment(value)}
            readOnly
          />
        </div>
      </div>

      <div className="Labels">
        <label htmlFor="purpose">Purpose of Mission</label>
        <textarea
          id="purpose"
          className="text_area"
          rows="3"
          cols="80"
          placeholder="Write purpose of mission here."
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          readOnly={isDisabled}
        ></textarea>
      </div>

      {
        reason !== null && reason.length !==0 ? 
        <div className="Labels">
          <label htmlFor="motive">“Motive to go into the mission over the weekend</label>
          <textarea
            id="motive"
            className="text_area"
            rows="3"
            cols="80"
            placeholder="Motive to go into the mission over the weekend"
            value={reason}
          >
            {reason}
          </textarea>
        </div> : ''
      }

      <h3 className="attachments">Attachments</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mission Support</td>
              <td id="file-name-cell"> 
                {
                  files.map((file, index) => (
                  <div key={index}>{file.name}</div>
                  ))
                }
              </td>
              <td>
                <div className="icon-container2">
                  <div className="action_icons">
                    <span class="icon-label">
                      <img src="Assets/attach.png" alt="Attach" onClick={isDisabled? ()=>{} : handleUploadClick} style={{cursor:'pointer'}}/>
                      <span style={{color: 'green', cursor: 'pointer'}} onClick={isDisabled? ()=>{} : handleUploadClick}>Attach</span>
                    </span>
                    <span class="icon-label">
                      <img src="Assets/clear.png" alt="Delete" onClick={isDisabled? ()=>{} : handleDeleteClick} style={{cursor:'pointer'}}/>
                      <span style={{color: 'red', cursor:'pointer'}} onClick={isDisabled? ()=>{} : handleDeleteClick}>Delete</span>
                    </span>
                    <span class="icon-label">
                      <img src="Assets/view.png" alt="View" onClick={handleViewClick} style={{cursor:'pointer'}}/>
                      <span style={{color: 'blue', cursor:'pointer'}} onClick={handleViewClick}>View</span>
                    </span>
                  </div>
          
                  <Modal
                    opened={showModal}
                    onClose={() => setShowModal(false)}
                    title={action === 'view' ? 'Select Document to View' : 'Select Document to Delete'}
                    centered
                    size="lg"
                  >
                    {
                      files.length === 0 ? (
                      <p align="center">No documents available</p>
                        ) : (
                      <List spacing="xs" size="sm" center>
                        {files.map((file, index) => (
                          <List.Item key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Button
                              variant="outline"
                              color={action === 'view' ? 'blue' : 'red'}
                              onClick={() => handleClick(index)}
                              style={{ flexGrow: 1 }}
                            >
                              {file.name}
                            </Button>
                          </List.Item>
                        ))}
                      </List>
                    )
                    }
                  </Modal>

                  <Modal
                    opened={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Confirm Deletion"
                    centered
                    size="sm"
                  >
                    <p>Are you sure you want to delete this document?</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <Button variant="outline" onClick={handleDeleteConfirm} style={{ marginRight: '0.5rem' }}>Confirm</Button>
                      <Button color="red" onClick={handleDeleteCancel}>Cancel</Button>
                    </div>
                  </Modal>

                  <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="Labels">
          <label htmlFor="expected-results">Expected Results</label>
          <textarea
            id="expected-results"
            className="text_area2"
            rows="3"
            cols="80"
            placeholder="Expected results after mission."
            value={expectedResults}
            onChange={(e) => setExpectedResults(e.target.value)}
            readOnly={isDisabled}
          ></textarea>
        </div>

        { !isDisabled ? 
          <div className="Labels">
          <label htmlFor="proposer_id">Who Proposed the Mission</label>
          <Select
            type="text"
            className="prop-id"
            placeholder="Search ID or Name"
            value={defaultProposer}
            data={employeeMinData}
            searchable
            onChange={(value)=> {
              setProposerId(value.split(' - ')[0].split(' ')[0]);
            }}
            nothingFoundMessage="Nothing found..."
            readOnly={isDisabled}
          />
        </div>
        :

        <div className="Labels">
          <label htmlFor="approved_id">Who Approved Mission</label>
          <Input
            type="text"
            className="prop-id"
            placeholder="Search ID or Name"
            value={defaultProposer}
          />
      </div>
        }

        <div className="Labels">
          <label htmlFor="approved_id">Who To Approve the Mission</label>
          <Input
            type="text"
            className="prop-id"
            placeholder="Approval ID or Name"
            value={defaultApprover}
            nothingFoundMessage="Nothing found..."
            onChange={(value)=> {
              setApprovedId(value.split(' - ')[0].split(' ')[0]);
            }}
            readOnly
          />
        </div>

        <div className="Labels">
          <label htmlFor="place_id">Place and Date of Departure</label>
          <Select
            type="text"
            className="depart-location"
            placeholder="Select Location"
            value={place}
            data={district}
            searchable
            onChange={handlePlaceChange}
            readOnly={isDisabled}
          />

          <DateInput
            type="text"
            className="datedepart"
            id="departureDate"
            defaultValue={dayjs(departureDate).toDate()} // Set the default date here
            minDate={new Date()}
            maxDate={dayjs(new Date()).add(1, 'month').toDate()}
            placeholder="Departure Date"
            onChange={(value) => {
              const newDate = value;
              setDepartureDate(newDate);
              
              if (locations.length > 0) {
                handleLocationChange(0, 'departureDate', newDate);
              }
            }}
            readOnly={isDisabled}
          />
        </div>

        <div>
          <DestinationTable
            locations={locations}
            district={district}
            place={place}
            handleLocationChange={handleLocationChange}
            handleAddRow={handleAddRow}
            deleteAllRows={deleteAllRows}
            handleDateChange={handleDateChange}
            isDisabled={isDisabled}
          />
        </div>

        <div className="Labels">
          <label htmlFor="return_id">Return Date</label>
          <DateInput
            type="text"
            id="return_id"
            className="return_date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            minDate={new Date()}
            maxDate={dayjs(new Date()).add(2, 'month').toDate()}
            placeholder="Date input"
            readOnly
          />
        </div>

        <div className="Labels">
          <label htmlFor="duration_id">Mission Duration</label>
          <Input
            type="text"
            id="duration_id"
            className="mission-duration"
            placeholder="Enter Mission Duration"
            value={missionDuration}
            onChange={(e) => setMissionDuration(e.target.value)}
            readOnly
          />
        </div>

        <div className="Labels">
          <label htmlFor="transport_id">Mode of Transport</label>
          <div className="transportCont">
            <Select
              type="text"
              className="missionallow_field_1"
              placeholder="Mode of Transport"
              data={allowade}
              searchable
              nothingFoundMessage="Nothing found..."
              value={transport}
              onChange={(value) => handleTransportChange(value)}
              readOnly={isDisabled}
            />
            {(transport === 'Private Car') && (
              <Input
                type="text"
                id="plate_id"
                className="plate"
                placeholder="Enter Vehicle Plate Number"
                value={plateNumber}
                onChange={handlePlateNumberChange}
                mt={5}
                readOnly={isDisabled}
              />
            )}
          </div> 
        </div>
      
        <div className="Labels">
          <label htmlFor="mission_allowance_id">Mission Allowance</label>
          <Input
            type="text"
            id="mission_allowance_id"
            className="missionallow_field"
            placeholder="Mission Allowance"
            value={isDisabled ? initialMissionAllowance.toLocaleString() : missionAllowance == 0 ? initialMissionAllowance.toLocaleString() : missionAllowance.toLocaleString() }
            readOnly
          />
        </div>
        
        <div className="Labels">
          <label htmlFor="transport_allowance_id">Transport Allowance</label>
          <Input
            type="text"
            id="transport_allowance_id"
            className="tranallow_field"
            placeholder="Transport Allowance"
            value={missionDetail.transportMileageAllowance !== '' ? missionDetail.transportMileageAllowance !== null ? missionDetail.transportMileageAllowance.toLocaleString() : '' : ''}
            disabled={missionDetail.transportMileageAllowance === null}
            readOnly
          />
        </div>
        
        <div className="Labels">
          <label htmlFor="total_amount_id">Total Amount</label>
          <Input
            type="text"
            id="total_amount_id"
            className="amount_field"
            placeholder="Total Amount"
            value={isDisabled ? missionDetail.totalAmount ? missionDetail.totalAmount.toLocaleString() : '' : missionAllowance == 0 ? initialMissionAllowance.toLocaleString() : missionAllowance.toLocaleString()}
            disabled={missionDetail.totalAmount === null}
            readOnly
          />
        </div>

        <div className="buttons">
          <Button
            variant="filled"
            color="darkgreen"
            size="xs"
            radius="lg"
            id="submit"
            className="approval-btn"
            onClick={handleFormSubmit}
            disabled={isDisabled}
          >
            Resubmit for approval
          </Button>

          <>
            <Button
              variant="filled"
              color="darkred"
              size="xs"
              radius="lg"
              onClick={handleCancelClick}
              >
                Exit
            </Button>

            <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
              <DialogTitle sx={{ fontSize: '1rem', padding: '12px',color: 'black' }}>
                Are you sure you want to Exit?
              </DialogTitle>
              <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
                <Button
                  onClick={() => handleConfirmationClose(true)}
                  sx={{
                    border: '1px solid #d32f2f',
                    padding: '1px 2px',
                    fontSize: '0.65rem',
                    '&:hover': {
                      backgroundColor: '#f8d7da',
                    },
                  }}
                  size="xs"
                  radius="lg"
                  color="green"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleConfirmationClose(false)}
                  sx={{
                    border: '1px solid #388e3c',
                    padding: '1px 2px',
                    fontSize: '0.65rem',
                    '&:hover': {
                      backgroundColor: '#d0f0c0',
                    },
                  }}
                  size="xs"
                  radius="lg"
                  color="red"
                >
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </>
        </div>
       </>

      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Alert severity="info">Getting data ...</Alert>
        </Box>
      )}
    </div>

  );
}

export default MissionForm;
