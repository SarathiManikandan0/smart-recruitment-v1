import React, { useState } from 'react';
import axios from 'axios';
import './ApplicantRegister.css';
import { Link, navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HRRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/applicant/register/', { username, email, password });
            alert(response.data.message);
            navigate('/applicant/login'); 
        } catch (error) {
            alert('Registration failed: ' + error.response.data);
        }
    };

    return (
        <div className="register-page">
            <div className="register-form-container">
                <form onSubmit={handleSubmit} className="register-form">
                    <h1>Applicant Register</h1>
                    <label>
                        <span>Username</span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">Register</button>
                    <div className="APP_links">
                        <Link to="/applicant/login" className="login-link">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HRRegister;
