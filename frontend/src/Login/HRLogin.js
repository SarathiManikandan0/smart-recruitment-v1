import React, { useState } from 'react';
import axios from 'axios';
import './HRLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const HRLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, getValidAccessToken } = useAuth();  // Using your custom auth context

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', { username, password });

            const { access, refresh } = response.data.user; // Adjust this based on your API response structure
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            login({ type: 'hr', ...response.data.user });

            navigate('/dashboard');
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.error || error.message));
        }
    };

    // Example: Usage of getValidAccessToken before making API request
    const fetchProtectedData = async () => {
        const token = await getValidAccessToken();  // Refresh token if expired
        if (token) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/protected/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching protected data:', error);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1>HR Login</h1>
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
                        <Link to="/register" className="register">Register an account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HRLogin;
