import React, { useState } from 'react';
import axios from 'axios';
import './ApplicantLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ApplicantLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Using your custom auth context

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/applicant/login/', { username, password });

            // Store the access and refresh tokens in localStorage
            const { access, refresh } = response.data.user; // Adjust based on your API response structure
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Call the login function from useAuth (assuming it stores user info in context)
            login({ type: 'applicant', ...response.data.user }); // Ensure this includes the user info

            // Navigate to the applicant dashboard
            navigate('/applyjob');
        } catch (error) {
            // Handle errors
            alert('Login failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1>Applicant Login</h1>
                    <label>
                        <span>Username</span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">Login</button>
                    <div className="links">
                        <a href="#" className="forgot-password">Forgot password?</a>
                        <Link to="/applicant/register" className="register">Register an account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicantLogin;
