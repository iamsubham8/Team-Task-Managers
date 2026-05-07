import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LayoutDashboard, FolderKanban, LogOut, Code2, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass-panel">
            <div className="nav-brand">
                <Code2 size={28} />
                <span>TaskFlow</span>
            </div>
            
            <div className="nav-links">
                <Link 
                    to="/" 
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link 
                    to="/projects" 
                    className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FolderKanban size={18} /> Projects
                </Link>
                
                <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role}</div>
                    </div>
                    
                    <button 
                        onClick={toggleTheme} 
                        className="btn" 
                        style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)' }} 
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.5rem' }} title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
