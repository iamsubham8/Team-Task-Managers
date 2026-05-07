import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const Login = () => {
    const { login, signup } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Member');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await signup(username, password, role);
                setIsLogin(true); // Switch to login after successful signup
                setError('Signup successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="glass-panel auth-card">
                <h2 className="auth-title">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                
                {error && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', background: error.includes('successful') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: error.includes('successful') ? 'var(--success)' : 'var(--danger)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            placeholder="Enter your username"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            placeholder="Enter your password"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select 
                                className="form-input" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Member">Member</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Sign Up</>}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: '500' }}
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
