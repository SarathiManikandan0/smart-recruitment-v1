import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';
import HRLogin from './Login/HRLogin';
import HRRegister from './Login/HRRegister';
import ApplicantRegister from './Login/ApplicantRegister';
import ApplicantLogin from './Login/ApplicantLogin';
import Dashboard from './HRDashboard/Dashboard/Dashboard'
import Jobcreation from './HRDashboard/Jobcreation/Jobcreation';
import LandingPage from './LandingPage';
import { ApplyJob } from './ApplicantDashboard/ApplyJob';
import  Profile  from './ApplicantDashboard/Profile';
import { JobApplicants } from './HRDashboard/Dashboard/JobApplicants';

const ProtectedRoute = ({ children, allowedUserType }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.type !== allowedUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<HRRegister />} />
            <Route path="/applicant/register" element={<ApplicantRegister />} />
            <Route path="/login" element={<HRLogin />} />
            <Route path="/applicant/login" element={<ApplicantLogin />} />
            
            {/* HR Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedUserType="hr">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobcreation" 
              element={
                <ProtectedRoute allowedUserType="hr">
                  <Jobcreation />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/jobs/:jobId/applicants"  
              element={
                <ProtectedRoute allowedUserType="hr">
                  <JobApplicants />
                </ProtectedRoute>
              } 
            />

            {/* Applicant Protected routes */}
            
            <Route 
              path="/applyjob" 
              element={
                <ProtectedRoute allowedUserType="applicant">
                  <ApplyJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applicantprofile" 
              element={
                <ProtectedRoute allowedUserType="applicant">
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Add a catch-all route for 404 Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

