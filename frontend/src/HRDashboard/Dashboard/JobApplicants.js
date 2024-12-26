import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Sidebar } from './Sidebar';
import './JobApplicants.css';
import { useAuth } from '../../AuthContext';

export const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(null); // Track which applicant is being analyzed
  const { getValidAccessToken } = useAuth(); // Use the auth context

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = await getValidAccessToken(); // Get a valid access token
      if (!token) return; // Handle case where token is invalid

      try {
        const response = await axios.get(`http://localhost:8000/api/jobs/${jobId}/applicants/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setApplicants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobId, getValidAccessToken]); // Add getValidAccessToken to the dependency array

  const analyzeResume = async (applicantId) => {
    const token = await getValidAccessToken(); // Get a valid access token
    if (!token) return; // Handle case where token is invalid

    setAnalyzing(applicantId); // Set the currently analyzing applicant
    try {
      const response = await axios.post(
        `http://localhost:8000/api/jobs/analyze_resume/${applicantId}/${jobId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedApplicants = applicants.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, score: response.data.score } : applicant
      );
      setApplicants(updatedApplicants);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setAnalyzing(null); // Clear analyzing state
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="container">
        <h2>Applicants for Job </h2>
        <ul className="applicant-list">
          {loading ? (
            <Skeleton count={5} height={100} />
          ) : (
            applicants.map((applicant) => (
              <li key={applicant.id} className="applicant-card">
                <span>Name: {applicant.fullName}</span><br />
                <span>Phone number: {applicant.phone_number}</span><br />
                {applicant.resume ? (
                  <a href={applicant.resume} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                ) : (
                  <p>No resume available</p>
                )}
                {applicant.score ? (
                  <div className="applicant-details">
                    <p><strong>Relevance:</strong> {applicant.score.relevance}</p>
                    <p><strong>Experience:</strong> {applicant.score.experience}</p>
                    <p><strong>Skills Match:</strong> {applicant.score.skills_match}</p>
                    <p><strong>Formatting:</strong> {applicant.score.formatting}</p>
                  </div>
                ) : analyzing === applicant.id ? (
                  <p>Analyzing resume...</p>
                ) : (
                  <button 
                    onClick={() => analyzeResume(applicant.id)} 
                    disabled={analyzing !== null}
                  >
                    {analyzing === applicant.id ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
