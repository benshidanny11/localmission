import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import DescriptionIcon from '@mui/icons-material/Description';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import PreviewIcon from '@mui/icons-material/Preview';
import Notification from '../components/toastNotification';
import TravelClearanceReport from './travelClearanceReport';
import { cancelMissionReport } from '../redux/slices/missionSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CancelIcon from '@mui/icons-material/Cancel';
import 'react-toastify/dist/ReactToastify.css'; 

const ManageAction = ({ row }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  // const [detailedDialogOpen, setDetailedDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const open = Boolean(anchorEl);
  const subMenuOpen = Boolean(subMenuAnchorEl);
  const [hasNoMemo, setHasNoMemo] = useState(true);

  const componentRef = useRef(null);

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

  const handleConfirmationClose = (confirm) => {
    setConfirmationOpen(false);
    if (confirm) {
      handleCancelMissionReport();
    }
  };

  const handleCancelMissionReport = () => {
    if (row.status !== 'REPORTED') {
      setNotification({ message: 'Mission Order should have status of REPORTED', type: 'error' });
    } else {
      dispatch(cancelMissionReport(row.referenceId))
      .unwrap()
      .then(() => {
        toast.success("Mission Report Cancelled successfully!");
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

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  useState(()=> {
    const hasMemo = row.missionFiles.some(file => file.missionDocType === "MEMO");
    setHasNoMemo(!hasMemo);
  }, [row]);


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
          onClick={ ()=> navigate(`/my-mission-review?id=${row.referenceId}`) }
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
          row.reportSummary && 
          <MenuItem
            onClick={() => navigate(`/review-mission-report?id=${row.referenceId}`)}
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              padding: '4px 12px',
              fontSize: '0.75rem',
            }}
          >
            <FileOpenIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
            Review the mission report
          </MenuItem>
        }
        {
          !row.reportSummary && 
          <MenuItem
            onClick={() => navigate(`/upload-report?id=${row.referenceId}`)}
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              padding: '4px 12px',
              fontSize: '0.75rem',
            }}
            disabled={!['MISSION_PAYMENT_BATCH_CREATED'].includes(row.status)} // Disable item based on status
          >
            <DescriptionIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
            Submit Mission Reports
          </MenuItem>
        }

        {
          row.reportSummary && 
          <MenuItem
            onClick={()=>setConfirmationOpen(true)}
            disabled={!['REPORTED'].includes(row.status)}
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
              padding: '4px 12px',
              fontSize: '0.75rem',
            }}
          >
            <CancelIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
            Cancel Mission Reports
          </MenuItem>
        }
        
        <MenuItem
          onClick={() => navigate(`/claim-refund?id=${row.referenceId}`)}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
          disabled={!['MISSION_REPORT_ACCEPTED'].includes(row.status)} // Disable item based on status
        >
          <CurrencyExchangeIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Claim Mission Refund
        </MenuItem>
        <MenuItem
          onClick={() => navigate(`/mission-record-history?id=${row.referenceId}`)}
          sx={{
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
        >
          <HistoryIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Mission Record History
        </MenuItem>
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
          disabled={!['REPORTED', 'CLAIM_SUBMITTED', 'MISSION_REPORT_ACCEPTED'].includes(row.status)}
        >
          Mission Report
          <LocalPrintshopIcon sx={{ fontSize: '1rem' }} />
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

      {/* The component to print */}
      <div style={{ display: 'none' }}>
        <TravelClearanceReport ref={componentRef} data={row}/>
      </div>

      <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
        <DialogTitle sx={{ fontSize: '0.85rem', padding: '12px' , color:'black'}}>
          Are you sure you want to cancel mission?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={handleCancelMissionReport}
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
            onClick={() => handleConfirmationClose(false)}
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

export default ManageAction;
