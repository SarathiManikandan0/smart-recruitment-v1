import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/accounts/token/refresh/', { refresh: refreshToken });
                const newAccessToken = response.data.access;
                localStorage.setItem('accessToken', newAccessToken); // Update access token
                return newAccessToken;
            } catch (error) {
                logout(); // If refresh fails, log out
                return null;
            }
        }
        return null;
    };

    const getValidAccessToken = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            return null;
        }

        // Decode token to check expiration (or use your API’s check)
        const tokenExpiry = JSON.parse(atob(accessToken.split('.')[1])).exp;
        const isExpired = (Date.now() / 1000) > tokenExpiry;

        if (isExpired) {
            return await refreshAccessToken();
        }

        return accessToken;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, getValidAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
