import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './JobInfo.css'; 

export const JobInfo = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/jobs/');
        if (response.data) {
          setJobs(response.data); 
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobs();
  }, []);

  if (jobs.length === 0) return <p>Loading...</p>;

  return (
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
    <strong>Salary:</strong> {job.salaryRange}<br></br>
    <strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()} <br></br>
    <strong>Qualifications:</strong> {job.qualifications} <br></br>
    <strong>Responsibilities:</strong> {job.responsibilities}
  </p>
  
        <Link to={`/jobs/${job.id}/applicants`}>
          <button>View Applicants</button>
        </Link>
      </div>
    ))}
  </div>
  );
};
