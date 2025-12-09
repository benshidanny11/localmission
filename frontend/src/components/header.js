import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Popover, Box, List, ListItem, ListItemText, Avatar, Divider, ListItemIcon,Snackbar, SnackbarContent  } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Green icon for online status
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice'; 
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../utils/WebSocketService';
import { addNotification, fetchNotifications, markNotificationAsRead  } from '../redux/slices/notificationSlice';
import { fetchMissionDetails as fetchMissionApproval } from '../redux/slices/missionForApprovalSlice';
import { fetchMissionDetails } from '../redux/slices/missionSlice';
import CloseIcon from '@mui/icons-material/Close';

const timeDifference = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;

  return 'just now';
};


// Define a mapping for notification types and their corresponding icons
const notificationIcons = {
  SUBMITTED_FOR_APPROVAL: <CheckCircleIcon sx={{ color: 'blue' }} />,
  APPROVED: <CheckCircleIcon sx={{ color: 'green' }} />,
  MISSION_ORDER_RETURNED: <NotificationsNoneIcon sx={{ color: 'orange' }} />,
  MISSION_ORDER_REJECTED: <NotificationsNoneIcon sx={{ color: 'red' }} />,
  MISSION_ORDER_CLEARANCE_RECORD_CANCELLED: <NotificationsNoneIcon sx={{ color: 'purple' }} />,
  MISSION_COMPUTED: <NotificationsNoneIcon sx={{ color: 'cyan' }} />,
  MISSION_PAYMENT_BATCH_CANCELLED: <NotificationsNoneIcon sx={{ color: 'brown' }} />,
  REPORTED: <NotificationsNoneIcon sx={{ color: 'gray' }} />,
  CLAIM_SUBMITTED: <NotificationsNoneIcon sx={{ color: 'pink' }} />,
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fullnames } = useSelector(state => state.user);
  const { notifications } = useSelector(state => state.notification);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    dispatch(markNotificationAsRead());
  };

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchorEl(null);
    setAccountAnchorEl(null);
  };

  const openNotificationPopover = Boolean(notificationAnchorEl);
  const notificationPopoverId = openNotificationPopover ? 'notification-popover' : undefined;

  const openAccountPopover = Boolean(accountAnchorEl);
  const accountPopoverId = openAccountPopover ? 'account-popover' : undefined;

  const handleToggle = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const truncateMessage = (message) => {
    const words = message.split(' ');
    return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : message;
  };

  useEffect(()=> {
    dispatch(fetchNotifications());
  }, [])

  useEffect(() => {
    WebSocketService.connect( (notification) => {
      dispatch(addNotification(notification));
      dispatch(fetchMissionApproval());
      dispatch(fetchMissionDetails());
      handleSnackbarOpen();
    });

    return () => {
        WebSocketService.disconnect();
    };
}, []);

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ 
          maxHeight: '40px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ mt: '-12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 , ml: 5}}>
            <img
              src="Assets/bg_rra_logo.png"
              alt="Logo"
              style={{ width: '24px', height: '24px', marginRight: '8px'}}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '0.60rem', color: '#276b80' }}>
                    RWANDA REVENUE AUTHORITY
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'semibold', fontSize: '0.50rem', color: '#276b80', mt:-0.5 }}>
                    TAXES FOR GROWTH AND DEVELOPMENT
                </Typography>
                </Box>
          </Box>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              minWidth: 'auto',
              p: 1,
            }}
          >
            <Badge
              badgeContent={notifications.filter(notification => !notification.isRead).length}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem', // Adjust text size inside the badge
                  height: '12px', // Adjust badge height
                  minWidth: '12px', // Adjust badge width
                  padding: '0 1px', // Adjust padding to reduce size
                  mr:0.4
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleAccountClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              minWidth: 'auto',
              p: 1,
    
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Toolbar>

      </AppBar>

      {/* Notification Popover */}
      <Popover
  id={notificationPopoverId}
  open={openNotificationPopover}
  anchorEl={notificationAnchorEl}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  sx={{ mt: 1, width: '350px', borderRadius: '8px' }} // Removed boxShadow
>
  <Box sx={{ p: 1, maxWidth: '400px' }}> {/* Adjusted padding and maxWidth */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '300px' }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'primary.main' }}>
    Notifications
  </Typography>
  <Typography variant="body2" sx={{ color: 'black' }}>
    {`${notifications.filter(notification => !notification.isRead).length} new`}
  </Typography>
</Box>

    <Divider sx={{ my: 1, backgroundColor: 'blue', height: 2 }} /> {/* Thicker and more defined divider */}
    <List
      sx={{
        pt: 0,
        width: '100%',
        maxHeight: '250px', // Slightly increased max height for better view
        overflowY: 'auto', // Enable vertical scrolling
      }}
    >
      {notifications.map((notification, index) => ( // Display only the first 5 notifications
        <React.Fragment key={index}>
          <ListItem
            alignItems="flex-start"
            sx={{
              py: 1, 
              mt: -1,
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Subtle hover effect
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '28px',ml:-2 }}>
            {notificationIcons[notification.type] || <NotificationsNoneIcon sx={{ fontSize: '1.3rem', color: 'text.secondary' }} />}  
            </ListItemIcon>
            
<ListItemText
  primary={
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.62rem',whiteSpace: 'nowrap' }}>
        {notification.title}
      </Typography>
      <Box /> 
      <Typography variant="caption" color="textSecondary" sx={{ ml: 0.5, fontSize: '0.60rem',whiteSpace: 'nowrap' }}>
        {timeDifference(notification.date)}
      </Typography>
    </Box>
  }
  secondary={
    <>
      <Typography 
        component="span" 
        variant="body2" 
        color="textPrimary" 
        sx={{ 
          fontSize: '0.60rem',
          display: expanded[index] ? 'block' : 'inline',
          whiteSpace: expanded[index] ? 'pre-wrap' : 'nowrap',
          overflow: expanded[index] ? 'visible' : 'hidden',
          textOverflow: expanded[index] ? 'clip' : 'ellipsis',
        }}
        dangerouslySetInnerHTML={{
          __html: (expanded[index] ? notification.message : truncateMessage(notification.message)).replace(
            /(\b\d+\/\d+\b)/g, // Regex for referenceId (adjust pattern as needed)
            notification.type === 'SUBMITTED_FOR_APPROVAL' ?
            '<a href="/mission-review?id=$1" target="_blank" style="color: blue; text-decoration: underline;">$1</a>' : '$1'

          ),
        }}
      />
      {notification.message.split(' ').length > 5 && (
        <Typography 
          component="span" 
          variant="caption" 
          color="primary" 
          sx={{ ml: 1, cursor: 'pointer',fontSize: '0.58rem', }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggle(index);
          }}
        >
          {expanded[index] ? 'Hide Message' : 'View more'}
        </Typography>
      )}
    </>
  }
  
  
  
/>

          </ListItem>
          <Divider sx={{ my: 0.5, backgroundColor:'black' }} /> {/* Lighter and thinner divider between messages */}
        </React.Fragment>
      ))}
    </List>
  </Box>
</Popover>

      {/* Account Details Popover */}
      <Popover
  id={accountPopoverId}
  open={openAccountPopover}
  anchorEl={accountAnchorEl}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  sx={{ p: 2, mt: 1, width: 'auto' }} // Set width to auto to fit content
>
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    width: 'auto', // Let the width be determined by content
    maxWidth: '300px', // Optional: set a max-width if needed
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar 
        sx={{ width: 29, height: 29, ml: 1, mt: 1.2, backgroundColor: 'primary.main', color: 'white' }}>
        {fullnames[0].toUpperCase()}
      </Avatar>
      <Typography 
        variant="h6" 
        sx={{ 
          ml:1, 
          mr:1,
          fontWeight: 'bold',
          fontSize: '0.75rem', 
          mt: 0, 
          whiteSpace: 'nowrap', // Prevent text from wrapping
        }}
      >
        {fullnames}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
      <CheckCircleIcon sx={{ color: 'green', mr: 0.5, ml: 5.67, mt: -3, fontSize: 12 }} />
      <Typography variant="body2" color="textSecondary" sx={{ mt: -3, fontSize: 10 }}>
        Online
      </Typography>
    </Box>

    <Box sx={{ mt: -1 }}>
      <Typography 
        variant="body2" // Smaller font size
        color="red" 
        sx={{ 
          cursor: 'pointer', 
          ml: 15, 
          mr:2,
          border: '1px solid', 
          borderColor: 'red', 
          borderRadius: 1, 
          fontSize: '0.65rem',
          px: 0.3, 
          py: 0.1, 
          mb: 0.8,
          display: 'inline-block',
          '&:hover': {
            backgroundColor: 'darkred', // Hover effect changes background color
            borderColor: 'darkred', // Darker border on hover
            color: 'white'
          }
        }}
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
      >
        Logout
      </Typography>
    </Box>
  </Box>
</Popover>
<Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      autoHideDuration={3000} // Adjust auto hide duration as needed
    >
      <SnackbarContent
        sx={{
          backgroundColor: '#1976d2', // Change background color as needed
          color: '#fff', // Change text color as needed
          display: 'flex',
          alignItems: 'center',
          width: '180px',
          px:1
        }}
        message={
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1 }} /> {/* Notification Icon */}
            Check New Notification
          </span>
        }
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" sx={{ mr: 2 }} />
          </IconButton>
        }
      />
    </Snackbar>

    </>
  );
};

export default Header;