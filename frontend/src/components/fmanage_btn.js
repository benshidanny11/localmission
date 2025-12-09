import React, {useState} from 'react';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Snackbar, Alert } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cancelMission } from '../redux/slices/missionComputationForPaymentBatchReducer';

const FManageAction = ({ row }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const open = Boolean(anchorEl);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ message: '', type: ''});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    setNotificationMessage({ message: '', type: ''});
  }

  const handleConfirmationClose = (confirm) => {
    setConfirmationOpen(false);

    if (confirm) {
        if (row.status !== 'pmt batch created') {
            setNotificationMessage({ message: 'Mission Order should have status of pmt batch created', type: 'error' });
            setIsNotificationOpen(true);
        } else {
            dispatch(cancelMission(row.sn))
                .unwrap()
                .then(() => {
                  setTimeout(() => {
                    setNotificationMessage({ message: 'Mission cancelled successfully', type: 'success' });
                    setIsNotificationOpen(true);
                }, 0);
                })
                .catch((error) => {
                  setTimeout(() => {
                      setNotificationMessage({ message: error.message, type: 'error' });
                      setIsNotificationOpen(true);
                    }, 0);
                });
        }
    }
};


  return (
    <>
      <Snackbar open={isNotificationOpen} autoHideDuration={3000} onClose={handleNotificationClose}>
        <Alert
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleNotificationClose}
          severity={notificationMessage.type}
          variant="filled"
          sx={{ width: '100%' }}
          key={'top center'}
        >
          {notificationMessage.message}
        </Alert>
      </Snackbar>
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
          onClick={() => Navigate(`/mission-payment-batch-details?id=${row.sn}`)}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
          disabled={row.status === 'cancelled'}
        >
          <VisibilityIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          View Mission Payment Details
        </MenuItem>
        <MenuItem
          onClick={() => setConfirmationOpen(true)}
          sx={{
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            padding: '4px 12px',
            fontSize: '0.75rem',
          }}
          disabled={row.status === 'cancelled'}
        >
          <CancelIcon sx={{ fontSize: '1rem', marginLeft: '-8px', marginRight: '5px' }} />
          Cancel Mission Payment Batch
        </MenuItem>
      </Menu>

      <Dialog open={confirmationOpen} onClose={() => handleConfirmationClose(false)}>
        <DialogTitle sx={{ fontSize: '0.85rem', padding: '12px', color: 'black' }}>
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
              backgroundColor: 'green',
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
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FManageAction;
