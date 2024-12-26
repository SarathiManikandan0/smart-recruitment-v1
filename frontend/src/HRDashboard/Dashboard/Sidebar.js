import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate} from 'react-router-dom';
import './Sidebar.css';
import { useAuth } from './../../AuthContext'; 
export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };
  return (
    <div className="sidebar">
      <List>
        <ListItem button component={Link} to="/dashboard" className="sidebar-item">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/jobcreation" className="sidebar-item">
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Job Creation" />
        </ListItem>
        {/* <ListItem button component={Link} to="/jobapplicants">
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Applications" />
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
