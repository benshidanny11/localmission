import React, { useState, useEffect, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PaymentsIcon from '@mui/icons-material/Payments';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ViewListIcon from '@mui/icons-material/ViewList';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import PixIcon from '@mui/icons-material/Pix';
import { DrawerContext } from '../context/DrawerContext';

const drawerWidth = 321;

function Sidebar() {
  const { grade, department } = useSelector((state) => state.user);
  const { drawerVisible, handleDrawerOpen, handleDrawerClose } = useContext(DrawerContext);

  const location = useLocation();
  const [isDisabledForApproval, setIsDisabledForApproval] = useState(true);
  const [isDisabledForFinance, setIsDisabledForFinance] = useState(true);
  const [isDisabledForReports, setIsDisabledForReports] = useState(true);

  // State for different menu collapses
  const [openFinancial, setOpenFinancial] = useState(
    JSON.parse(localStorage.getItem('openFinancial')) || false
  ); // Retrieve from localStorage or default to false
  const [openLocalMission, setOpenLocalMission] = useState(
    JSON.parse(localStorage.getItem('openLocalMission')) || false
  );
  const [openListOfMissions, setOpenListOfMissions] = useState(
    JSON.parse(localStorage.getItem('openListOfMissions')) || false
  );

  // Store the menu state in localStorage
  useEffect(() => {
    localStorage.setItem('openFinancial', openFinancial);
  }, [openFinancial]);

  useEffect(() => {
    localStorage.setItem('openLocalMission', openLocalMission);
  }, [openLocalMission]);

  useEffect(() => {
    localStorage.setItem('openListOfMissions', openListOfMissions);
  }, [openListOfMissions]);

  // Handle click for "FINANCIAL OPERATIONS"
  const handleFinancialClick = () => {
    setOpenFinancial(!openFinancial);
    setOpenLocalMission(false); // Collapse other sections
    setOpenListOfMissions(false);
  };

  // Handle click for "Local Mission Management"
  const handleLocalMissionClick = () => {
    setOpenLocalMission(!openLocalMission);
    setOpenFinancial(true);
    setOpenListOfMissions(false);
  };

  // Handle click for "LIST OF MISSIONS"
  const handleListOfMissionsClick = () => {
    setOpenListOfMissions(!openListOfMissions);
    setOpenLocalMission(true);
    setOpenFinancial(true);
  };

  useEffect(() => {
    const allowedGrades = ["E3", "E2", "E1", "M3","M2"];
    if (allowedGrades.includes(grade)) {
      setIsDisabledForApproval(false);
    }
  }, [grade]);

  useEffect(() => {
    const allowedGrades = ["E3", "E2", "E1", "M3", "M2"];
    if (allowedGrades.includes(grade)) {
      setIsDisabledForReports(false);
    }
  }, [grade]);

  useEffect(() => {
    const allowedGradesFinance = ["P2", "T2", "P1", "E1"];
    if (JSON.parse(department).id === 15 && allowedGradesFinance.includes(grade)) {
      setIsDisabledForFinance(false);
    }
  }, [grade]);


  const isSelected = (path) => location.pathname === path;

  const poppinsFontStyle = { fontFamily: "'Poppins', sans-serif" };

  return (
    <>
      <Drawer
        sx={{
          width: drawerVisible ? drawerWidth : 60,
          flexShrink: 0,
          display: drawerVisible ? 'block' : 'none',
          '& .MuiDrawer-paper': {
            width: drawerVisible ? drawerWidth : 60,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            position: 'relative',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1000,
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: '50%',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <MenuOpenIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <List sx={poppinsFontStyle}>
          <ListItem 
            onClick={handleFinancialClick} 
            sx={{ mb: -4, py: 4, cursor: 'pointer',
              '&:hover': {
               color: 'gray', // Color change on hover
                } 
             }}
          >
            <ListItemIcon sx={{ minWidth: 20 }}>
              <PixIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="FINANCIAL OPERATIONS"
              primaryTypographyProps={{ 
                fontSize: '0.93rem', 
                fontWeight: 'bold', 
                sx: {  cursor: 'pointer', 
                  color: openFinancial ? 'black' : 'inherit',
                }
              }} 
            />
            {openFinancial ? <ExpandLessIcon sx={{ fontSize: 18, mr: -0.4 }} /> : <ExpandMoreIcon sx={{ fontSize: 18, mr: -0.4 }} />}
          </ListItem>

          <Collapse in={openFinancial} timeout="auto" unmountOnExit>
            <ListItem button onClick={handleLocalMissionClick} sx={{ paddingLeft: 4, paddingRight: 1.5, py: 0.5, mb: -1 }}>
              <ListItemIcon sx={{ minWidth: 20 }}>
                <ViewListIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                secondary="Local Mission Management"
                secondaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 'bold' }}
                sx={{ marginLeft: 0.4 }}
              />
              {openLocalMission ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
            </ListItem>

            <Collapse in={openLocalMission} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  onClick={handleListOfMissionsClick}
                  sx={{
                    pl: 7,
                    py: 0,
                    backgroundColor: isSelected('/missions') ? '#9e9c99' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <ListAltIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    secondary="List of Missions"
                    secondaryTypographyProps={{ fontWeight: 'semibold' }}
                    sx={{ marginLeft: 0.4 }}
                  />
                  {openListOfMissions ? <ExpandLessIcon sx={{ fontSize: 18, mr: -0.4 }} /> : <ExpandMoreIcon sx={{ fontSize: 18, mr: -0.4 }} />}
                </ListItem>

                <Collapse in={openListOfMissions} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 8, mt: -1.2, mb: -1.2 }}>
                    <Link to="/my-missions" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <ListItem button sx={{ py: 0, backgroundColor: isSelected('/my-missions') ? '#9e9c99' : 'transparent' }}>
                        <ListItemIcon sx={{ minWidth: 15 }}>
                          <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                        </ListItemIcon>
                        <ListItemText secondary="My Missions" sx={{ fontSize: '0.55rem' }} />
                      </ListItem>
                    </Link>

                    <Link
                      to={isDisabledForApproval ? "#" : "/missions-for-approval"}
                      style={{
                        textDecoration: 'none',
                        color: isDisabledForApproval ? 'gray' : 'inherit',
                        pointerEvents: isDisabledForApproval ? 'none' : 'auto', // Prevent clicks when disabled
                        cursor: isDisabledForApproval ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ListItem
                        button
                        sx={{
                          py: 0,
                          backgroundColor: isSelected('/missions-for-approval') ? '#9e9c99' : 'transparent',
                          opacity: isDisabledForApproval ? 0.5 : 1 // Make the item look faded when disabled
                        }}
                        disabled={isDisabledForApproval} // Set disabled property for the ListItem
                      >
                        <ListItemIcon sx={{ minWidth: 15 }}>
                          <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                        </ListItemIcon>
                        <ListItemText secondary="Missions for Approval" sx={{ fontSize: '0.55rem' }} />
                      </ListItem>
                    </Link>

                    <Link to={isDisabledForFinance ? "#" : "/missions-allowance-computation"}
                    style={{
                        textDecoration: 'none',
                        color: isDisabledForFinance ? 'gray' : 'inherit',
                        pointerEvents: isDisabledForFinance ? 'none' : 'auto', // Prevent clicks when disabled
                        cursor: isDisabledForFinance ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <ListItem
                        button
                        sx={{
                          py: 0,
                          backgroundColor: isSelected('/missions-allowance-computation') ? '#9e9c99' : 'transparent',
                          opacity: isDisabledForFinance ? 0.5 : 1 // Make the item look faded when disabled
                        }}
                        disabled={isDisabledForFinance} // Set disabled property for the ListItem
                      >
                        <ListItemIcon sx={{ minWidth: 15 }}>
                          <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                        </ListItemIcon>
                        <ListItemText secondary="Missions Allowance Computation" sx={{ fontSize: '0.55rem' }} />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>

                <Link to={isDisabledForFinance ? "#" : "/mission-payments" }
                
                style={{
                        textDecoration: 'none',
                        color: isDisabledForFinance ? 'gray' : 'inherit',
                        pointerEvents: isDisabledForFinance ? 'none' : 'auto', // Prevent clicks when disabled
                        cursor: isDisabledForFinance ? 'not-allowed' : 'pointer'
                      }}
                      >
                  <ListItem
                    button
                        sx={{
                          py: 0,
                          pl: 7,
                          backgroundColor: isSelected('/mission-payments') ? '#9e9c99' : 'transparent',
                          opacity: isDisabledForFinance ? 0.5 : 1 // Make the item look faded when disabled
                        }}
                        disabled={isDisabledForFinance}
                  >
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <PaymentsIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      secondary="Mission Payment Lists"
                      secondaryTypographyProps={{ fontWeight: 'semibold' }}
                      sx={{ marginLeft: 0.4 }}
                    />
                  </ListItem>
                </Link>

                <Link to={isDisabledForReports ? "#" : "/generate-mission-reports" }
                  style={{
                        textDecoration: 'none',
                        color: isDisabledForReports ? 'gray' : 'inherit',
                        pointerEvents: isDisabledForReports ? 'none' : 'auto', // Prevent clicks when disabled
                        cursor: isDisabledForReports ? 'not-allowed' : 'pointer'
                      }}
                    >
                  <ListItem
                    button
                        sx={{
                          py: 0,
                          pl: 7,
                          backgroundColor: isSelected('/generate-mission-reports') ? '#9e9c99' : 'transparent',
                          opacity: isDisabledForReports ? 0.5 : 1 // Make the item look faded when disabled
                        }}
                        disabled={isDisabledForReports}
                  >
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <SummarizeIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      secondary="Mission Reports"
                      secondaryTypographyProps={{ fontWeight: 'semibold' }}
                      sx={{ marginLeft: 0.4 }}
                    />
                  </ListItem>
                </Link>

              </List>
            </Collapse>
          </Collapse>
        </List>
      </Drawer>
      
      {!drawerVisible && (
        <IconButton
          onClick={handleDrawerOpen}
          sx={{
            position: 'absolute',
            top: 2,
            left: 16,
            zIndex: 1000,
            width: 35,
            height: 35,
            padding: 0,
            borderRadius: '40%',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>
      )}
      
    </>
  );
}

export default Sidebar;
