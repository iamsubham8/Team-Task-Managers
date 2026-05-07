import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const signup = async (username, password, role) => {
        await axios.post('/api/auth/signup', { username, password, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
