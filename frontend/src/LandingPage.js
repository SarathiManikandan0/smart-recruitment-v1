import React from 'react';
import './LandingPage.css'; 
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <section className="landing">
        <div className="landing-content">
          <h1 className="landing-title">Recruitment Agency</h1>
          <p className="landing-description">
           Smart Recruitment Website is your one-stop shop for finding top talent. We use cutting-edge technology to streamline the hiring process, making it faster and more efficient for both employers and job seekers.
          </p>
          <div className="button-group">
            <Link to="/login" className="btn contact-btn">HR Login</Link>
            <Link to="/applicant/login" className="btn read-btn">Applicant Login</Link>
          </div>
        </div>
        <div className="landing-image">
        <img src="/team-leader.png" alt="Team Leader" />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
