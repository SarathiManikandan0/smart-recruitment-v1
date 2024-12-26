import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplyJob.css'; 
import { ApplicantSidebar } from './ApplicantSidebar';
import { useAuth } from './../AuthContext'; // Import your AuthContext

export const ApplyJob = () => {
  const { getValidAccessToken } = useAuth(); // Get token management function from AuthContext
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/jobs/');
        if (response.data) {
          setJobs(response.data); 
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobs();
  }, []);

  // Function to handle applying for a job
  const handleApply = async (jobId) => {
    try {
      // Get the valid access token
      const token = await getValidAccessToken();

      // Check if token exists
      if (!token) {
        alert('You must be logged in to apply for jobs.');
        return;
      }

      // Set the Authorization header with the JWT token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.post(`http://localhost:8000/api/jobs/${jobId}/apply/`, {}, config);
      alert('Successfully applied for the job!');
    } catch (error) {
      console.error('Error applying for the job:', error);
      alert('Failed to apply for the job. Please try again.');
    }
  };

  if (jobs.length === 0) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <ApplicantSidebar />
      <div className="job-list">
        {jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <div className="job-details">
              <span className="job-icon">📍</span>
              <span className="job-loc">{job.location}</span>
              <span className="job-emp">💼</span>
              <span className="job-type">{job.employmentType}</span>
            </div>
            <h3>{job.jobTitle}, {job.department}</h3>
            <p>{job.jobDescription}</p>
            <p>
              <strong>Salary:</strong> {job.salaryRange}<br />
              <strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}<br />
              <strong>Qualifications:</strong> {job.qualifications}<br />
              <strong>Responsibilities:</strong> {job.responsibilities}
            </p>
            <button onClick={() => handleApply(job.id)} className="apply-btn">
              Apply for this job
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
