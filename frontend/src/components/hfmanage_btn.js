import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Backdrop } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import PreviewIcon from '@mui/icons-material/Preview';
import Notification from '../components/toastNotification';
import { cancelMission } from '../redux/slices/missionForApprovalSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import 'react-toastify/dist/ReactToastify.css'; 
import ReactToPrint from 'react-to-print';
import TravelClearanceReport from './travelClearanceReport';

const HFManageAction = ({ row }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const open = Boolean(anchorEl);
  const subMenuOpen = Boolean(subMenuAnchorEl);
  const { grade } = useSelector(state => state.user);
  const [hasNoMemo, setHasNoMemo] = useState(true);

  const componentRef = useRef(null);


  useState(()=> {
    const hasMemo = row.missionFiles.some(file => file.missionDocType === "MEMO");
    setHasNoMemo(!hasMemo);
  }, [row]);

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

  const handleCancelMissionOrder = () => {
    handleDetailedDialogClose();
    if (row.status !== 'APPROVED') {
      setNotification({ message: 'Mission Order should have status of APPROVED', type: 'error' });
    } else {
      if (reason.length !== 0) {
        dispatch(cancelMission({ referenceId: row.referenceId, reason }))
          .unwrap()
          .then(() => {
            toast.success("Mission Cancelled successfully!");
          })
          .catch((error) => {
            toast.error(error.message || 'An error occurred');
          });
      } else {
        setNotification({ message: 'Reason for cancellation cannot be empty', type: 'error' });
      }
    }
    setReason('');
  };
  
  const grades = ["P1", "T3", "T2"];

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

  const handleSubItem3Click = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = (confirm) => {
    setConfirmationOpen(false);
    if (confirm) {
      setDetailedDialogOpen(true);
    }
  };

  const handleDetailedDialogClose = () => {
    setDetailedDialogOpen(false);
    setReason('');
  };

 

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    const wordCount = newValue.split(/\s+/).filter(Boolean).length;

    if (wordCount <= 50) {
      setReason(newValue);
    }
  };

  const wordCount = reason.split(/\s+/).filter(Boolean).length;

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
          row.reportSummary && 
          <MenuItem
            onClick={() => navigate(`/approver-review-mission-report?id=${row.referenceId}`)}
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
        
        <MenuItem
          onClick={handleSubItem3Click} 
          disabled={row.status === 'APPROVED'?  grades.includes(grade)  : true }
          sx={{
            
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
        >
          <CancelIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Cancel Mission
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
          disabled={!['REPORTED', 'CLAIM_SUBMITTED', 'MISSION_REPORT_ACCEPTED'].includes(row.status)}
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


      {/* Confirmation Dialog */}
      <div style={{ display: 'none' }}>
        <TravelClearanceReport ref={componentRef} data={row}/>
      </div>
      <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
        <DialogTitle sx={{ fontSize: '0.85rem', padding: '12px' , color:'black'}}>
          Are you sure you want to cancel mission?
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={() => handleConfirmationClose(true)}
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

      {/* Detailed Dialog */}
      <Backdrop open={detailedDialogOpen} sx={{ zIndex: 1300 }}>
        <Dialog
          open={detailedDialogOpen}
          onClose={handleDetailedDialogClose}
          sx={{
            width: '1000px', // Increased width
            maxWidth: '90vw', // Responsive width
            margin: 'auto', // Center the dialog
          }}
        >
          <DialogTitle
            sx={{
              ml:3,
              mr:3,
              mt:1,
              color: 'black',
              marginBottom: '4px',
              fontSize: '0.78rem', // Font size for title
              backgroundColor: '#696969',
              padding: '4px',
              textAlign: 'center', // Center the title text
              borderRadius: '5px'
            }}
          >
            Mission Cancellation
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reason}
              onChange={handleTextChange}
              placeholder="Provide the reasons why Mission is cancelled not more than 50 words"
              helperText={`Word Count: ${wordCount} / 50 words`} 
              sx={{
                '& .MuiInputBase-input': {
                  boxShadow: 'none',
                  fontSize: '0.75rem',
                  width: '400px',
                  mt:-1.5,
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
            
            <Button
              onClick={handleCancelMissionOrder}
              sx={{
                padding: '2px 4px',
                fontSize: '0.65rem',
                textTransform: 'none',
                color: '#ffffff',
                backgroundColor: 'green',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={handleDetailedDialogClose}
              sx={{
                padding: '2px 4px',
                fontSize: '0.65rem',
                textTransform: 'none',
                color: '#ffffff',
                backgroundColor: 'red',
                border: '1px solid #d32f2f',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
      <ToastContainer />
    </>
  );
};

export default HFManageAction;
