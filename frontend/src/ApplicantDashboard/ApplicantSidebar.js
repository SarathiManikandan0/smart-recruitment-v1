import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate} from 'react-router-dom';
import './ApplicantSidebar.css';
import { useAuth } from './../AuthContext';


export const ApplicantSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <div className="applicantsidebar">
      <List>
        <ListItem button component={Link} to="/applicantprofile" className="sidebar-item">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button component={Link} to="/applyjob" className="sidebar-item">
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Jobs" />
        </ListItem>
        {/* <ListItem button className="sidebar-item">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Job Status" />
        </ListItem> */}
        <ListItem button onClick={handleLogout} className="sidebar-item">
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </div>
  );
};
