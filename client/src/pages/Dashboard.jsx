import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { format, isPast, parseISO } from 'date-fns';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get('/api/tasks');
            setTasks(res.data);
            
            // Calculate stats
            const now = new Date();
            let completed = 0, pending = 0, overdue = 0;
            
            res.data.forEach(task => {
                if (task.status === 'Completed') completed++;
                else {
                    pending++;
                    if (task.due_date && isPast(parseISO(task.due_date))) overdue++;
                }
            });
            
            setStats({ total: res.data.length, completed, pending, overdue });
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/tasks/${id}`, { status });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return <span className="badge badge-completed">Completed</span>;
            case 'In Progress': return <span className="badge badge-progress">In Progress</span>;
            default: return <span className="badge badge-pending">Pending</span>;
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.username}!</p>
                </div>
            </div>

            <div className="grid" style={{ marginBottom: '2rem' }}>
                <div className="glass-panel card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Tasks</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.total}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="glass-panel card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success)' }}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Completed</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.completed}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-panel card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Overdue</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.overdue}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Your Tasks</h2>
            
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                {tasks.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>No tasks found.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map(task => (
                            <div key={task.id} style={{ padding: '1.25rem', background: 'var(--panel-inner-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Project: {task.project_name}</p>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem' }}>
                                        {getStatusBadge(task.status)}
                                        {task.due_date && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: isPast(parseISO(task.due_date)) && task.status !== 'Completed' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                                                <Clock size={14} /> 
                                                {format(parseISO(task.due_date), 'MMM dd, yyyy')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <select 
                                        className="form-input" 
                                        style={{ width: 'auto', padding: '0.5rem' }}
                                        value={task.status}
                                        onChange={(e) => updateStatus(task.id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Also import LayoutDashboard for the icon
import { LayoutDashboard } from 'lucide-react';

export default Dashboard;
