import React, { useState, useEffect } from 'react'; 
import './Jobcreation.css';
import { Sidebar } from '../Dashboard/Sidebar';
import axios from 'axios';

function Jobcreation() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    department: '',
    location: '',
    employmentType: '',
    salaryRange: '',
    applicationDeadline: '',
    qualifications: '',
    responsibilities: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
  
    // Convert dd/mm/yyyy to yyyy-mm-dd
    const [day, month, year] = formData.applicationDeadline.split('/');
    const formattedDate = `${year}-${month}-${day}`;
  
    const jobData = {
      ...formData,
      applicationDeadline: formattedDate 
    };
  
    try {
      const response = await axios.post('http://localhost:8000/api/jobs/', jobData);
      console.log('Job published successfully:', response.data);
      setFormData({
        jobTitle: '',
        jobDescription: '',
        department: '',
        location: '',
        employmentType: '',
        salaryRange: '',
        applicationDeadline: '',
        qualifications: '',
        responsibilities: ''
      });
      alert('Job published successfully!');
    } catch (error) {
      console.error('Error publishing job:', error);
      alert('Error publishing job. Please try again.');
    }
  };
  

  const handleGenerate = async () => {
    if (!formData.jobTitle) {
        alert('Please enter a job title to generate the job description.');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post('http://localhost:8000/api/jobs/generate-job/', { jobTitle: formData.jobTitle });
        const generatedData = response.data;


        setFormData(prevFormData => {
            const newFormData = {
                ...prevFormData,
                jobTitle: generatedData["Job Title"] || prevFormData.jobTitle,
                jobDescription: generatedData["Job Description"] || prevFormData.jobDescription,
                department: generatedData["Department"] || prevFormData.department,
                location: generatedData["Job Location"] || prevFormData.location,
                employmentType: generatedData["Employment Type"] || prevFormData.employmentType,
                salaryRange: generatedData["Salary Range"] || prevFormData.salaryRange,
                applicationDeadline: generatedData["Application Deadline"] || prevFormData.applicationDeadline,
                qualifications: Array.isArray(generatedData["Required Qualifications"])
                    ? generatedData["Required Qualifications"].join(', ') 
                    : prevFormData.qualifications,
                responsibilities: Array.isArray(generatedData["Responsibilities"]) 
                    ? generatedData["Responsibilities"].join(', ') 
                    : prevFormData.responsibilities
            };
            return newFormData;
        });

        setLoading(false);
    } catch (error) {
        console.error('Error generating job description:', error);
        setLoading(false);
        alert('Error generating job description. Please try again.');
    }
};

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="jobcreation">
        <form className="job-creation-form" onSubmit={handlePublish}>
          <h2>Job Creation :</h2>
          
          <input 
            type="text" 
            name="jobTitle" 
            placeholder="Enter the Job Title *" 
            value={formData.jobTitle} 
            onChange={handleChange} 
            required 
          />
          
          <div className="Gen_buttons" >
          <button type="button" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Job Description'}
          </button></div>
          
          <textarea
            name="jobDescription"
            placeholder="Enter Job Description *"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          />
          

          <input
            type="text"
            name="department"
            placeholder="Enter the department *"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input 
            type="text" 
            name="location" 
            placeholder="Enter the job location *" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />

          <input 
            type="text" 
            name="employmentType" 
            placeholder="Enter employment type (Full Time / Part Time) *" 
            value={formData.employmentType} 
            onChange={handleChange} 
            required 
          />

          <input 
            type="text" 
            name="salaryRange" 
            placeholder="Enter the salary range *" 
            value={formData.salaryRange} 
            onChange={handleChange} 
            required 
          />

          <input 
            type="text" 
            name="applicationDeadline" 
            placeholder="Enter application deadline (DD/MM/YYYY) *" 
            value={formData.applicationDeadline} 
            onChange={handleChange} 
            required 
          />

          <input 
            type="text" 
            name="qualifications" 
            placeholder="Enter the required qualifications" 
            value={formData.qualifications} 
            onChange={handleChange} 
          />

          <input 
            type="text" 
            name="responsibilities" 
            placeholder="Enter the job responsibilities" 
            value={formData.responsibilities} 
            onChange={handleChange} 
          />

          <div className="buttons">
            <button type="submit">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Jobcreation;
