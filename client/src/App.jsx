import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            {user && <Navbar />}
            <div className={`main-container ${user ? 'with-nav' : ''}`}>
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
                </Routes>
            </div>
        </Router>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
