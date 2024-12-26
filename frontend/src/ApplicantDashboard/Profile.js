import React, { useState, useEffect } from 'react';
import './Profile.css';
import { ApplicantSidebar } from './ApplicantSidebar';
import axios from 'axios';
import { useAuth } from './../AuthContext';

const Profile = () => {
    const { user, getValidAccessToken } = useAuth();  // Assuming you have user authentication context
    const [profile, setProfile] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        course: '',
        department: '',
        institution: '',
        phone_number: '',
        address: '',
        skills: '',
        experience: '',
        file: null,
    });

    const [profileExists, setProfileExists] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = await getValidAccessToken(); // Fetch a valid token
            if (!token) {
                console.error('No access token available.');
                return;
            }

            try {
                // Fetch the profile using the logged-in user's data
                const response = await axios.get(`http://localhost:8000/api/accounts/applicants/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
                setProfileExists(true); // Profile exists
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setProfileExists(false); // Profile doesn't exist
                } else {
                    console.error('Error fetching profile:', error.response?.data);
                }
            }
        };

        fetchProfile();
    }, [getValidAccessToken]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = (e) => {
        setProfile({ ...profile, file: e.target.files[0] });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('dateOfBirth', profile.dateOfBirth);
        formData.append('gender', profile.gender);
        formData.append('course', profile.course);
        formData.append('department', profile.department);
        formData.append('institution', profile.institution);
        formData.append('phone_number', profile.phone_number);
        formData.append('address', profile.address);
        formData.append('skills', profile.skills);
        formData.append('experience', profile.experience);

        if (profile.file) {
            formData.append('resume', profile.file);
        }

        const token = await getValidAccessToken(); // Fetch a valid token
        if (!token) {
            console.error('No access token available.');
            return;
        }

        try {
            if (profileExists) {
                // Update existing profile
                const response = await axios.put(`http://localhost:8000/api/accounts/applicants/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                alert('Profile updated:', response.data);
            } else {
                // Create new profile
                const response = await axios.post(`http://localhost:8000/api/accounts/applicants/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Profile created:', response.data);
            }
        } catch (error) {
            console.error('Error submitting profile:', error.response?.data);
        }
    };

    return (
        <div className="dashboard-container">
            <ApplicantSidebar />
            <div className="profile-container">
                <h2>Basic Details</h2>
                <form>
                    <div className="form-container">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={profile.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                value={profile.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value={profile.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <textarea
                                name="address"
                                placeholder="Address"
                                value={profile.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <textarea
                                name="skills"
                                placeholder="Skills"
                                value={profile.skills}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                name="experience"
                                placeholder="Experience (years)"
                                value={profile.experience}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="course"
                                placeholder="Current Course"
                                value={profile.course}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                accept=".pdf"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="institution"
                                placeholder="Institution Name"
                                value={profile.institution}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={profile.department}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
