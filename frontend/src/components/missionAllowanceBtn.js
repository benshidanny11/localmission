import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useNavigate } from 'react-router-dom';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PreviewIcon from '@mui/icons-material/Preview';
import Notification from '../components/toastNotification';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { cancelMissionComputation } from '../redux/slices/missionForComputationSlice';
import ReactToPrint from 'react-to-print';
import TravelClearanceReport from './travelClearanceReport';

const HFManageAction = ({ row }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [confirmationOpenCancel, setConfirmationOpenCancel] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const open = Boolean(anchorEl);
  const subMenuOpen = Boolean(subMenuAnchorEl);
  const { grade } = useSelector(state => state.user);
  const [hasNoMemo, setHasNoMemo] = useState(true);

  const componentRef = useRef(null);

  const Navigate = useNavigate();

  const handleCancelMissionComputation = () => {
    if (row.status !== 'MISSION_COMPUTED') {
      setNotification({ message: 'Mission Order should have status of Mission computed', type: 'error' });
    } else {
      dispatch(cancelMissionComputation({referenceId: row.referenceId}))
      .unwrap()
      .then(() => {
        toast.success("Mission computation Cancelled successfully!");
      })
      .catch((error) => {
        toast.error(error.message || 'An error occurred');
      });
    }
  };

  const handleDownloadSupportDoc = () => {
    row.missionFiles.filter((file) => file.missionDocType === "SUPPORT").forEach(({missionFile} )=> {
      const url = `${process.env.REACT_APP_BACKEND_URL}/files/${missionFile}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      link.download = url.split('/').pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownloadReport = () => {
    row.missionFiles.filter((file) => file.missionDocType === "REPORT").forEach(({missionFile} )=> {
      const url = `${process.env.REACT_APP_BACKEND_URL}/files/${missionFile}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      link.download = url.split('/').pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownloadClaimRefund = () => {
    row.missionFiles.filter((file) => file.missionDocType === "REFUND").forEach(({missionFile} )=> {
      const url = `${process.env.REACT_APP_BACKEND_URL}/files/${missionFile}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      link.download = url.split('/').pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDownloadMEMO = () => {
    row.missionFiles.filter((file) => file.missionDocType === "MEMO").forEach(({missionFile} )=> {
      const url = `${process.env.REACT_APP_BACKEND_URL}/files/${missionFile}`;
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      link.download = url.split('/').pop(); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  useState(()=> {
    const hasMemo = row.missionFiles.some(file => file.missionDocType === "MEMO");
    setHasNoMemo(!hasMemo);
  }, [row]);
  
  const grades = ["P1", "T2", "P2", "E1"];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleHomeClick = (event) => {
    setAnchorEl(null); // Close the first menu
    setSubMenuAnchorEl(event.currentTarget); // Open submenu at this item
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return (
    <>
    <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <Button
        variant="contained"
        color="success"
        endIcon={
          <ArrowDropDownIcon
            sx={{
                ml: -1.2,
              color: 'white',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        }
        onClick={handleClick}
        sx={{
          backgroundColor: 'green',
          color: 'white',
          '&:hover': {
            backgroundColor: 'darkgreen',
          },
          textTransform: 'none',
          fontSize: '0.60rem',
          padding: '2px 4px',
        }}
      >
        Manage
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            borderRadius: '10px',
            padding: '2px',
          },
        }}
      >
        <MenuItem
          onClick={handleHomeClick}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
            display: 'flex',
          }}
        >
          <VisibilityIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          <span>View Mission Documents</span>
        </MenuItem>
        <MenuItem
          onClick={ ()=> navigate(`/mission-review?id=${row.referenceId}`) }
          disabled={grades.includes(grade)}
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
        >
          <PreviewIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Review Mission Order
        </MenuItem>

        {
          row.status !== 'MISSION_COMPUTED' &&
            <MenuItem
              onClick={() => Navigate(`/mission-fee-computation-details?id=${row.referenceId}`)}
              disabled={row.status === 'APPROVED'?  !grades.includes(grade)  : true }
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                padding: '4px 12px',
                fontSize: '0.75rem',
              }}
            >
          <CalculateIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Compute Mission Allowance
        </MenuItem>
      }
      
      {
        row.status === 'MISSION_COMPUTED' &&
        <MenuItem
            onClick={()=> setConfirmationOpenCancel(true)}
            disabled={row.status === 'MISSION_COMPUTED'?  !grades.includes(grade)  : true }
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              padding: '4px 12px',
              fontSize: '0.75rem',
            }}
          >
        <CalculateIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
        Cancel Mission Allowance
      </MenuItem>
    
    }
        
      </Menu>

      <Menu
        anchorEl={subMenuAnchorEl}
        open={subMenuOpen}
        onClose={handleClose}
        sx={{
          '& .MuiMenu-paper': {
            borderRadius: '10px',
            padding: '1px',
            marginTop: '-30px',
           
          },
        }}
      >

        <ReactToPrint
          trigger={() => (
            <MenuItem
              onClick={handleClose}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                padding: '4px 12px',
                fontSize: '0.75rem',
                display: 'flex',
                justifyContent: "space-between"
              }}
            >
              Mission Order
              <LocalPrintshopIcon sx={{ fontSize: '1rem', marginLeft: '8px' }} />
            </MenuItem>
          )}
          content={() => componentRef.current} // Point to the component to print
        />

        <MenuItem
          onClick={handleDownloadSupportDoc}
          sx={{
            '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            padding: '4px 12px',
            fontSize: '0.75rem',
            display: 'flex',
            justifyContent: "space-between"
          }}
        >
          Mission Support Documents
          <LocalPrintshopIcon sx={{ fontSize: '1rem', marginLeft: '8px' }} />
        </MenuItem>
        <MenuItem
          onClick={handleDownloadReport}
          disabled={!['REPORTED', 'CLAIM_SUBMITTED'].includes(row.status)}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            padding: '4px 12px',
            fontSize: '0.75rem',
            display: 'flex',
            justifyContent: "space-between"
          }}
        >
          Mission Report
          <LocalPrintshopIcon sx={{ fontSize: '1rem', marginLeft: '8px' }} />
        </MenuItem>

        <MenuItem
          onClick={handleDownloadClaimRefund}
          disabled={!['CLAIM_SUBMITTED'].includes(row.status)}
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
            display: 'flex',
            justifyContent: "space-between"
          }} // Disable item based on status
        >
          Claim Refund Support Documents
          <LocalPrintshopIcon sx={{ fontSize: '1rem', marginLeft: '8px' }} />
        </MenuItem>

        <MenuItem
          onClick={handleDownloadMEMO}
          disabled={hasNoMemo}
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
            display: 'flex',
            justifyContent: "space-between"
          }} // Disable item based on status
        >
          MEMO Documents
          <LocalPrintshopIcon sx={{ fontSize: '1rem', marginLeft: '8px' }} />
        </MenuItem>

      </Menu>

      {/* Detailed Dialog */}
      <div style={{ display: 'none' }}>
        <TravelClearanceReport ref={componentRef} data={row}/>
      </div>
      <Dialog open={confirmationOpenCancel} onClose={() => setConfirmationOpenCancel(false)}>
        <DialogTitle sx={{ fontSize: '0.85rem', padding: '12px' , color:'black'}}>
          Are you sure you want to cancel mission computation?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={handleCancelMissionComputation}
            sx={{
              border: '1px solid #388e3c',
              padding: '2px 4px',
              fontSize: '0.65rem',
              color: '#ffff',
              backgroundColor:'green',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => setConfirmationOpenCancel(false)}
            sx={{
              border: '1px solid #d32f2f',
              padding: '2px 4px',
              fontSize: '0.65rem',
              color: '#ffff',
              backgroundColor:'red',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default HFManageAction;