import React, { useState, useEffect } from 'react';
import '../assets/css/missionForm.css';
import '@mantine/core/styles.css';
import Notification from './toastNotification'; // Import the Notification component
import dayjs from 'dayjs';
import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';
import '@fontsource-variable/nunito-sans';
import { Box, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import axiosInstance from '../utils/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, TextField, DialogContent, Backdrop } from '@mui/material';
import { fetchMissionDetails, rejectMission, retunMission, submitForApproval } from '../redux/slices/missionForApprovalSlice';
import { fetchEmployees } from '../redux/slices/employeeSlice';
import DestinationTable from './destinationTable';
import UploadFileIcon from '@mui/icons-material/UploadFile';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

function MissionReviewForm() {
  
  const { missionDetails, loading, error, hasFetched } = useSelector(state => state.approvalMissions);
  const { employees } = useSelector(state => state.employees);
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');

  const [missions, setMissions] = useState(null);

  const [staffId, setStaffId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedResults, setExpectedResults] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [employeeData, setEmployeeData] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [rows, setRows] = useState([])
  const [showConfirmationOther, setShowConfirmationOther] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonText, setReasonText] = useState('');
  const [reasonWeekend, setReasonWeekend] = useState('');
  const [memo, setMemo] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showReasonModalWeekend, setShowReasonModalWeekend] = useState(false);
  const [actionType, setActionType] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState('');
  const [locations, setLocations] = useState([{ location: '', dateFrom: '', dateTo: '', days: '', nights: '' }]);
  const [district, setDistrict] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [missionDuration, setMissionDuration] = useState('');
  const [missionAllowance, setMissionAllowance] = useState('');
  const [missionTotalAmount, setMissionTotalAmount] = useState('');
  const [transportMileageAllowance, setTransportMileageAllowance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [place, setPlace] = useState('');

  
  const dispatch = useDispatch();

  const handleAction = (type) => {
    setActionType(type);
    setShowConfirmationOther(true);
  };

  // internal memo upload pdf validation
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState(''); // State for the message
  const [memoFile, setMemoFile] = useState();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;

      // Check if the file type is PDF
      if (fileType === 'application/pdf') {
        setFileName(file.name); // Update the state with the file name
        setMessage(''); // Clear any previous message
        setMemoFile(file);
      } else {
        setFileName(''); // Clear file name if the file is not a PDF
        setMessage('Please upload a PDF file.'); // Set a simple message
        event.target.value = '';
      }
    }
  };
  

  const handleConfirmationCloseModal = (confirmed) => {
    if (confirmed) {
      setShowConfirmationOther(false);
      setShowReasonModal(true);
    } else {
      setShowConfirmationOther(false);
    }
  };

  const handleTextChange = (e) => {
    setReasonText(e.target.value);
  };

  const handleTextWeekendChange = (e) => {
    setReasonWeekend(e.target.value);
  };

  const handleReasonSubmit = () => {
    if (reasonText.split(/\s+/).filter(Boolean).length === 0) {
      setNotification({ message: "Reason required!", type: 'error' });
      return;
    }

    if (reasonText.split(/\s+/).filter(Boolean).length > 50) {
      setNotification({ message: "Reason can't exceed 50 words.!", type: 'error' });
      return;
    }

    setIsLoading(true);

    switch (actionType) {
      case 'reject':
        dispatch(rejectMission({ referenceId:missions.referenceId, reason:reasonText })).unwrap()
        .then(() => {
          setNotification({ message: "Mission Rejected successfully!", type: 'success' });
          setTimeout(() => {
            navigate("/missions-for-approval");
          }, 1000);
        })
        .catch((error) => {
          setNotification({ message: error["message"].replace("_", " ").toLowerCase(), type: 'error' });
          setReasonText('');
        });
        break;
      case 'return':
        dispatch(retunMission({ referenceId:missions.referenceId, reason:reasonText })).unwrap()
        .then(() => {
          setNotification({ message: "Mission Returned successfully!", type: 'success' });
          setTimeout(() => {
            navigate("/missions-for-approval");
          }, 1000);
        })
        .catch((error) => {
          setNotification({ message: error["message"].replace("_", " ").toLowerCase(), type: 'error' });
          setReasonText('');
        });
        break;
      default:
        break;
    }
    setIsLoading(false);
    setShowReasonModal(false);
  };

  const handleDetailedDialogClose = () => {
    setReasonText('');
    setReasonWeekend('')
    setShowReasonModal(false);
    setShowReasonModalWeekend(false);
  };



  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromQuery = queryParams.get('id') || '';
    setId(idFromQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched && !loading && !error && (!missionDetails || missionDetails.length === 0)) {
        await dispatch(fetchMissionDetails());
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, dispatch, hasFetched, loading, error, missionDetails]);

  useEffect(() => {
    const fetchMissionDetails = async () => {
      try {
        // let newMission = missionDetails?.find(m => m.referenceId === id);
  
        // if (!newMission) {
          const response = await axiosInstance.get(`/missionDetails/reference?referenceId=${id}`);
          let newMission = response.data;
        // }
  
        if (newMission) {
          const { employeeId } = newMission.employee;
          setStaffId(employeeId);
          setPurpose(newMission.purposeOfMission);
          setExpectedResults(newMission.expectedResults);
          setReason(newMission.weekendReason);
          setDepartureDate(newMission.startDate);
          setReturnDate(dayjs(new Date(newMission.endDate)));
          setMissionDuration(`${newMission.missionDays} days, ${newMission.missionNights} nights`);
          setIsDisabled(newMission.status !== "SUBMITTED_FOR_APPROVAL");
          setMissionAllowance(newMission.missionAllowance);
          setMissionTotalAmount(newMission.totalAmount);
          setTransportMileageAllowance(newMission.transportMileageAllowance);
          
          // Transform mission destinations
          const locationsNew = transformMissionDestinations(newMission.missionDestinations);
          setLocations(locationsNew);
  
          setMissions(newMission);
  
          // Filter mission files and prepare them for rows
          const supportFiles = prepareSupportFiles(newMission.missionFiles);
          setRows(supportFiles);
  
          // Prepare destination data for the state
          const destinationsData = prepareDestinationsData(newMission.missionDestinations);
          setDestinations(destinationsData);
        }
      } catch (error) {
        console.error('Error fetching mission details:', error);
      }
    };
  
    // Helper functions
    const transformMissionDestinations = (destinations) => {
      return destinations.map((destination) => {
        const { district, startDate, endDate, numberOfDays, numberOfNights } = destination;
        return {
          location: district.districtName,
          dateFrom: new Date(`${startDate}T00:00:00+02:00`),
          dateTo: new Date(`${endDate}T00:00:00+02:00`),
          days: numberOfDays,
          nights: numberOfNights,
        };
      });
    };
  
    const prepareSupportFiles = (missionFiles) => {
      return missionFiles
        .filter((file) => file.missionDocType === "SUPPORT")
        .map((file) => ({
          url: `${process.env.REACT_APP_BACKEND_URL}/files/${file.missionFile}`,
        }));
    };
  
    const prepareDestinationsData = (destinations) => {
      return destinations.map((destination) => ({
        id: destination.id,
        districtId: destination.district.districtCode,
        startDate: formatDate(destination.startDate),
        endDate: formatDate(destination.endDate),
        numberOfDays: destination.numberOfDays,
        numberOfNights: destination.numberOfNights,
      }));
    };
  
    if (id) {
      fetchMissionDetails();
    }
  }, [id, missionDetails]);
    

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

  useEffect(() => {
    const fetchData = async () => {
      if (!employees || employees.length === 0) {
        await dispatch(fetchEmployees());
      }
    };

    fetchData();
  
  }, [dispatch, employees]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (missions) {
        const missionEmployeeId = missions.employee.employeeId;
        if (employees && employees.length > 0) {
          const existingEmployee = employees.find(employee => employee.employeeId === missionEmployeeId);
          if (existingEmployee) {
            setEmployeeData(existingEmployee);
            return;
          }
        }

        try {
          const response = await axiosInstance.get(`/employees/search?searchTerm=${missionEmployeeId}`);
          setEmployeeData(response.data[0]);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      }
    };
  
    fetchEmployeeData();
  }, [missions, employees]);

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

  const handleDateChange = (index, field, value) => {
    if (validateDates(index, field, value)) {
      handleLocationChange(index, field, value);
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

  //FORM SUBMIT
  const handleFormSubmitWeekend = async() => {
    setShowReasonModalWeekend(false);
    if (reasonWeekend == null || reasonWeekend.length === 0) {
      setNotification({ message: "Reason for crossing over the weekend should be provided.", type: 'error' });
      return;
    }

      // Commented due to Louise request
  
    // if (memoFile === undefined) {f
    //   setReasonWeekend('');
    //   setNotification({ message: "Please attach a crossing over the weekend internal memo.", type: 'error' });
    //   return;
    // }

    setIsLoading(true);

    const mssnDuration = missionDuration.match(/\d+/g).map(Number);

    // Create a FormData object for mission details
    const missionDetail = {
      referenceId: missions.referenceId,
      purposeOfMission: purpose,
      expectedResults: expectedResults,
      startDate: formatDate(departureDate),
      endDate: formatDate(returnDate),
      missionDays: mssnDuration[0],
      missionNights: mssnDuration[1],
      missionAllowance: missionAllowance,
      missionDestinations: destinations,
      weekendReason: reasonWeekend
    };

    const formData = new FormData();
    formData.append('missionDetail', JSON.stringify(missionDetail));
    formData.append('missionFiles', memoFile);

    setIsLoading(true);

    dispatch(submitForApproval(formData))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission Approved successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/missions-for-approval");
      }, 3000);
      setIsLoading(false);
    })
    .catch((error) => {
      setReasonWeekend('');
      setNotification({ message: error["message"], type: 'error' });
      setIsLoading(false);
    });

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

  
  const handlePlaceChange = (value) => {
    setPlace(value);
    console.log("place is:", value)
  };
  
  const calculateMissionDuration = (locations) => {
    const place = missions?.place || "Unknown"; // Safely access missions.place with fallback
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
            let nightsSpent = 0; // Initialize nights to 0
            
            // If the location is different from the place of departure, calculate nights
            if (location !== place) {
                nightsSpent = toDate.diff(fromDate, 'day');
            } else {
                console.log(`Returning home each day from location: "${location}". Nights set to 0.`);
            }
            
            // Adjust days if there's an overlap with the previous location
            if (i > 0) {
                const prevDateTo = dayjs(locations[i - 1].dateTo);
                if (fromDate.isSame(prevDateTo, 'day')) {
                    daysSpent -= 1; // Subtract 1 day for overlap
                }
            }
            
            locations[i] = {
                ...locations[i],
                days: daysSpent,
                nights: nightsSpent,
            };
            
            totalDays += daysSpent;
            totalNights += nightsSpent;
        }
    }
    
    // Update mission duration
    setMissionDuration(`${totalDays} days, ${totalNights} nights`);
    return locations;
};

  useEffect(() => {
    if (place) {
      calculateMissionDuration(locations, place);
    }
  }, [place, locations]); // Trigger when either place or locations change

  const handleFormSubmit = async(e) => {
    e.preventDefault();

    if (!purpose) {
      setNotification({ message: 'Purpose is required!', type: 'error' });
      return;
    }

    if (!expectedResults) {
      setNotification({ message: 'Expected Results is required!', type: 'error' });
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

    if((reason == null || reason === '') && (reasonWeekend == null || reasonWeekend === '')) {
      const dates = {
        "startDate": formatDate(departureDate),
        "endDate": formatDate(returnDate)
      };
      try {
        const response = await axiosInstance.post('/hod/cross-over-weekend-validate', dates);
        if(response.data.crossOver){
          setReasonWeekend('');
          setShowReasonModalWeekend(true);
          return;
        }
      } catch (error) {
        console.log(error.response);
        setNotification({ message: 'Something went wrong, Please try again!', type: 'error' });
        return;
      }
      
    }
    const mssnDuration = missionDuration.match(/\d+/g).map(Number);
    // Create a FormData object for mission details
    const missionDetail = {
      referenceId: missions.referenceId,
      purposeOfMission: purpose,
      expectedResults: expectedResults,
      startDate: formatDate(departureDate),
      endDate: formatDate(returnDate),
      missionDays: mssnDuration[0],
      missionNights: mssnDuration[1],
      missionAllowance: missionAllowance,
      missionDestinations: destinations,
      weekendReason: reason
    };

    setIsLoading(true);

    const formData = new FormData();
    formData.append('missionDetail', JSON.stringify(missionDetail));

    if(memoFile !== undefined) {
      formData.append('missionFiles', memoFile);
    }

    dispatch(submitForApproval(formData))
    .unwrap()
    .then(() => {
      setNotification({ message: "Mission Approved successfully!", type: 'success' });
      setTimeout(() => {
        navigate("/missions-for-approval");
      }, 3000);
      setIsLoading(false);
    })
    .catch((error) => {
      setReasonWeekend('');
      setNotification({ message: error["message"], type: 'error' });
      setIsLoading(false);
    });

  };


  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  //CANCEL FORM SUBMISSION
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleCancelClick = () => {
    setConfirmationOpen(true); // Open the confirmation dialo;
  };

  const handleConfirmationClose = (confirmed) => {
    setConfirmationOpen(false); // Close the confirmation dialog

    if (confirmed) {
      navigate(-1);
    }
  };

  
  
  if (!missions) {
    return  <div className="container">
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
  {/* Left Side */}
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
      src="/assets/bg_rra_logo.png" 
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
  
  {/* Right Side */}
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
</div>

  }

  return (
    <div className="container">
      {/* Notification Pop-up */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
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
            {/* Left Side */}
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
            
            {/* Right Side */}
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
          <Input type="text" id="reference" className="reference_input" value={missions.referenceId} readOnly />
        </div>

        <div className="LabelTop">
          <label htmlFor="date" className="date-field">Date: </label>
          <div style={{fontSize: '15px'}}>{formatDate(missions.createdAt)}</div>
          {/* <Input type="date" id="date" className="date_input"  value=  readOnly /> */}
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
          value={missions.employee.employeeId + " - " + missions.employee.givenName + " "+missions.employee.familyName}
          readOnly
        />
      </div> */}
      </div>

      {/* Staff Information */}
      <div className="container1">
        <div className="Labels">
          <label htmlFor="name">Staff Names</label>
          <Input
            type="text"
            id="name"
            className="staff-name"
            placeholder="Staff Names"
            value={missions.employee.givenName + " "+missions.employee.familyName}
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
            value={employeeData !== null && employeeData.placement !== null ? employeeData.placement.jobMaster.jobTitle : ''}
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
            value={employeeData !== null && employeeData.placement !== null ? employeeData.placement.structure.structureName : ''}
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
          onChange={(event) => setPurpose(event.target.value)}
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

      <div className="box"> 
      <Box component="main" 
      sx={{ 
        flexGrow: 2, p: 1,
        marginLeft: 19, 
        marginTop: 1,
      }}
      >
      <TableContainer component={Paper} sx={{ width: 447 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'lightgray' }}>
              <TableCell sx={{ color: 'black', fontSize: '0.8rem', textAlign: 'center' }}>
                Click Link to View Mission Support Documents (Attachments)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
                  <Link href={row.url} target="_blank" rel="noopener">
                    {`Attachment ${index + 1}.pdf`}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
      </div>      

      <div className="Labels">
        <label htmlFor="expected-results">Expected Results</label>
        <textarea
          id="expected-results"
          className="text_area2"
          rows="3"
          cols="80"
          placeholder="Expected results after mission."
          value={expectedResults}
          onChange={(event)=> setExpectedResults(event.target.value)}
        ></textarea>
      </div>

      <div className="Labels">
        <label htmlFor="proposer_id">Who Proposed Mission</label>
        <Input
        type="text"
        className="prop-id"
      placeholder="Search ID or Name"
      value={missions.proposer.givenName +" "+missions.proposer.familyName}
    />
      </div>

      <div className="Labels">
        <label htmlFor="approved_id">Who Approved Mission</label>
        <Input
        type="text"
        className="prop-id"
      placeholder="Search ID or Name"
      value={missions.approver.givenName +" "+missions.approver.familyName}
    />
      </div>

      <div className="Labels">
        <label htmlFor="place_id">Place and Date of Departure</label>
        <Input
        type="text"
        className="depart-location"
      placeholder="Select Location"
      value={missions.place}
      onChange={handlePlaceChange}
    />
      <DateInput
        type="text"
        className="datedepart"
        id="departureDate"
        defaultValue={dayjs(departureDate).toDate()}
        minDate={new Date()}
        maxDate={dayjs(new Date()).add(1, 'month').toDate()}
        value={new Date(missions.startDate)}
        readOnly
        placeholder="Departure Date"
        onChange={(value) => {
              const newDate = value;
              setDepartureDate(newDate);
              
              if (locations.length > 0) {
                handleLocationChange(0, 'departureDate', newDate);
              }
            }}
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
          />
        </div>

      <div className="Labels">
        <label htmlFor="return_id">Return Date</label>
        <DateInput
          type="text"
          id="return_id"
          className="return_date"
          value={returnDate}
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
        />
      </div>

      <div className="Labels">
        <label htmlFor="transport_id">Mode of Transport</label>
        <div className="transportCont">
            <Input
                type="text"
                className="missionallow_field_1"
                placeholder="Mode of Transport"
                nothingFoundMessage="Nothing found..."
                value={missions.transportMode.replace("_", " ")}
                readOnly
            />
            {(missions.transportMode === 'PRIVATE_CAR') && (
            <Input
            type="text"
            id="plate_id"
            className="plate"
            placeholder="Enter Vehicle Plate Number"
            value={missions.plate}
            readOnly
            mt={5}
            />
        )}
        </div>
        
      </div>
      

    
  <div className="Labels">
    <label htmlFor="mission_allowance_id">Mission Allowance </label>
    <Input
      type="text"
      id="mission_allowance_id"
      className="missionallow_field"
      placeholder="Mission Allowance"
      value={missionAllowance.toLocaleString()}
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
      disabled
    />
  </div>
  
  <div className="Labels">
    <label htmlFor="total_amount_id">Total Amount</label>
    <Input
      type="text"
      id="total_amount_id"
      className="amount_field"
      placeholder="Total Amount"
      value={transportMileageAllowance == null ? missionAllowance.toLocaleString() : missionTotalAmount.toLocaleString()}
      readOnly
    />
  </div>



      <div className="buttons">
        <Button variant="filled" color="darkgreen" size="xs" radius="lg"
        id="submit" 
        className="approval-btn" 
        onClick={handleFormSubmit}
        disabled={isDisabled || isLoading}
        >Approve</Button>

        <Button variant="filled" color="darkblue" size="xs" radius="lg"
        id="submit" 
        className="approval-btn" 
        onClick={()=>handleAction('return')}
        disabled={isDisabled || isLoading}
        >Return</Button>

        <Button variant="filled" color="darkorange" size="xs" radius="lg"
        id="submit" 
        className="approval-btn" 
        onClick={()=>handleAction('reject')}
        disabled={isDisabled || isLoading}
        >Reject</Button>

        <>
        <Button
        variant="filled"
        color="darkred"
        size="xs"
        radius="lg"
        onClick={()=>handleCancelClick()}
        disabled={isLoading}
      >Exit</Button>

      <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
        <DialogTitle sx={{ fontSize: '1rem', padding: '12px', color:'black' }}>
          Are you certain you want to close this form?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
        <Box
            onClick={() => handleConfirmationClose(true)}
            sx={{
              display: 'inline-block',
              padding: '1px 12px',
              fontSize: '1rem',
              backgroundColor: 'green',
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            YES
          </Box>
          <Box
            onClick={() => handleConfirmationClose(false)}
            sx={{
              display: 'inline-block',
              padding: '1px 12px',
              fontSize: '1rem',
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            NO
          </Box>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationOther} onClose={() => handleConfirmationCloseModal(false)}>
        <DialogTitle sx={{ fontSize: '1rem', padding: '12px', color: 'black' }}>
          Are you sure you want to {actionType} the mission?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Box
            onClick={() => handleConfirmationCloseModal(true)}
            sx={{
              display: 'inline-block',
              padding: '1px 12px',
              fontSize: '1rem',
              backgroundColor: 'green',
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            YES
          </Box>
          <Box
            onClick={() => handleConfirmationCloseModal(false)}
            sx={{
              display: 'inline-block',
              padding: '1px 12px',
              fontSize: '1rem',
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            NO
          </Box>
        </DialogActions>
      </Dialog>

      {/* Detailed Reason Dialog */}
      <Backdrop open={showReasonModal} sx={{ zIndex: 1300 }}>
        <Dialog
          open={showReasonModal}
          onClose={handleDetailedDialogClose}
          sx={{
            width: '1000px', // Increased width
            maxWidth: '90vw', // Responsive width
            margin: 'auto', // Center the dialog
          }}
        >
          <DialogTitle
            sx={{
              ml: 3,
              mr: 3,
              mt: 1,
              color: 'black',
              marginBottom: '5px',
              fontSize: '0.78rem', // Font size for title
              backgroundColor: '#696969',
              padding: '4px',
              textAlign: 'center', // Center the title text
              borderRadius: '5px',
            }}
          >
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Mission
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reasonText}
              onChange={handleTextChange}
              placeholder={`Provide the reason why the mission is ${actionType}ed (at least 50 words)`}
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  fontSize: '0.75rem',
                  width: '400px',
                  mt:-1
                },
              }}

            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              padding: '8px',
            }}
          >
            <Box
              onClick={handleReasonSubmit}
              sx={{
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '0.75rem',
                backgroundColor: 'green',
                color: 'white',
                textAlign: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
              }}
            >
              Confirm
            </Box>
            
            <Box
              onClick={handleDetailedDialogClose}
              sx={{
                display: 'inline-block',
                padding: '3px 8px',
                fontSize: '0.75rem',
                backgroundColor: 'red',
                color: 'white',
                border: '1px solid #d32f2f',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Cancel
            </Box>

            
          </DialogActions>
        </Dialog>
      </Backdrop>

      <Backdrop open={showReasonModalWeekend} sx={{ zIndex: 1300 }}>
        <Dialog
          open={showReasonModalWeekend}
          onClose={handleDetailedDialogClose}
          sx={{
            width: '1000px', // Increased width
            maxWidth: '90vw', // Responsive width
            margin: 'auto', // Center the dialog
          }}
        >
          <DialogTitle
            sx={{
              ml: 3,
              mr: 3,
              mt: 1,
              color: 'white',
              marginBottom: '0.2px',
              fontSize: '0.78rem', // Font size for title
              backgroundColor: '#5982b2',
              padding: '4px',
              textAlign: 'center', // Center the title text
              borderRadius: '5px',
              mb:1
            }}
          >
            {actionType.charAt(0).toUpperCase() + actionType.slice(1)} 
            The Mission crosses over the weekend days, Please Explain ?
          </DialogTitle>
          <DialogContent> 
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reasonWeekend}
              onChange={handleTextWeekendChange}
              placeholder={`Provide the reason why the mission is crossing over the weekend (at least 50 words)`}
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  fontSize: '0.75rem',
                  width: '400px',
                  mt: -1.5,
                },
              }}
            />

            {/* Label and upload option */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}> {/* Flexbox for horizontal alignment */}
              <Typography variant="body2" sx={{ fontSize: '0.75rem', mr: 1 , color: 'black', fontWeight:'bold'}}>
                Attach a signed memo:
              </Typography>

              {/* Icon with file input */}
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <UploadFileIcon sx={{ color: 'gray', cursor: 'pointer', fontSize: '2rem' }} />
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  value={memo}
                  onChange={handleFileUpload} // Function to handle file selection
                />
                <Typography variant="body2" sx={{ fontSize: '0.65rem', ml: 0, mt:1 }}>
                  UPLOAD
                </Typography>
              </label>
            </Box>
            {/* Display file name below if uploaded */}
            {fileName && (
              <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 1 }}>
                <span style={{ color: 'green' }}>Uploaded file:</span> {/* "Uploaded file" in green */}
                <span style={{ color: 'blue', fontWeight: 'bold', marginLeft: '4px' }}>{fileName}</span> {/* File name in blue */}
              </Typography>
            )}
             {/* Display simple message if the file is not a PDF */}
              {message && (
                <Typography variant="body2" sx={{ fontSize: '0.75rem', mt: 1, color: 'red' }}>
                  {message}
                </Typography>
              )}


          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              padding: '8px',
              
            }}
          >
            <Box
              onClick={handleFormSubmitWeekend}
              sx={{
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '0.75rem',
                backgroundColor: 'green',
                color: 'white',
                textAlign: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
              }}
            >
              Confirm
            </Box>
            <Box
              onClick={handleDetailedDialogClose}
              sx={{
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '0.75rem',
                backgroundColor: 'red',
                color: 'white',
                textAlign: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Cancel
            </Box>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </>
        
      </div>
    </div>

  );
}

export default MissionReviewForm;
