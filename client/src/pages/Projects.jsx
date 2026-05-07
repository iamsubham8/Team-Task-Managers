import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Projects = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null);
    const [projectDetails, setProjectDetails] = useState({});
    
    // Modals state
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Form states
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskAssignee, setTaskAssignee] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');

    useEffect(() => {
        fetchProjects();
        if (user.role === 'Admin') {
            fetchUsers();
        }
    }, [user.role]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/projects');
            setProjects(res.data);
        } catch (error) {
            console.error('Error fetching projects', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/auth/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const fetchProjectDetails = async (id) => {
        if (expandedProject === id) {
            setExpandedProject(null);
            return;
        }
        try {
            const res = await axios.get(`/api/projects/${id}`);
            setProjectDetails({ ...projectDetails, [id]: res.data });
            setExpandedProject(id);
        } catch (error) {
            console.error('Error fetching project details', error);
        }
    };

    const createProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/projects', { name: projectName, description: projectDesc });
            setShowProjectModal(false);
            setProjectName('');
            setProjectDesc('');
            fetchProjects();
        } catch (error) {
            console.error('Error creating project', error);
        }
    };

    const deleteProject = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
        try {
            await axios.delete(`/api/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project', error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', {
                project_id: selectedProjectId,
                title: taskTitle,
                description: taskDesc,
                assigned_to: taskAssignee,
                due_date: taskDueDate
            });
            setShowTaskModal(false);
            setTaskTitle('');
            setTaskDesc('');
            setTaskAssignee('');
            setTaskDueDate('');
            fetchProjectDetails(selectedProjectId); // Refresh tasks
        } catch (error) {
            console.error('Error creating task', error);
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Projects</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your projects and team tasks.</p>
                </div>
                {user.role === 'Admin' && (
                    <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
                        <Plus size={18} /> New Project
                    </button>
                )}
            </div>

            <div className="grid">
                {projects.map(project => (
                    <div key={project.id} className="glass-panel card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div 
                            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            onClick={() => fetchProjectDetails(project.id)}
                        >
                            <div>
                                <h3 className="card-title">{project.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{project.description}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.role === 'Admin' && (
                                    <button 
                                        className="btn btn-danger" 
                                        style={{ padding: '0.5rem' }} 
                                        onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                {expandedProject === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {expandedProject === project.id && projectDetails[project.id] && (
                            <div style={{ padding: '1.5rem', background: 'var(--panel-inner-bg)', borderTop: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Tasks</h4>
                                    {user.role === 'Admin' && (
                                        <button 
                                            className="btn btn-primary" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            onClick={() => { setSelectedProjectId(project.id); setShowTaskModal(true); }}
                                        >
                                            <Plus size={14} /> Add Task
                                        </button>
                                    )}
                                </div>

                                {projectDetails[project.id].tasks?.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No tasks in this project.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {projectDetails[project.id].tasks?.map(task => (
                                            <div key={task.id} style={{ padding: '1rem', background: 'var(--panel-card-bg)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <strong style={{ fontSize: '0.95rem' }}>{task.title}</strong>
                                                    <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{task.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    <span>Assigned to: <span style={{ color: 'var(--text-primary)' }}>{task.assigned_to_username || 'Unassigned'}</span></span>
                                                    {task.due_date && <span>Due: {format(parseISO(task.due_date), 'MMM dd, yyyy')}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Project Modal */}
            {showProjectModal && (
                <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
                    <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="form-group">
                                <label className="form-label">Project Name</label>
                                <input type="text" className="form-input" required value={projectName} onChange={e => setProjectName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows="3" value={projectDesc} onChange={e => setProjectDesc(e.target.value)}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} onClick={() => setShowProjectModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Task Modal */}
            {showTaskModal && (
                <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
                    <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add Task</h2>
                        <form onSubmit={createTask}>
                            <div className="form-group">
                                <label className="form-label">Task Title</label>
                                <input type="text" className="form-input" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows="2" value={taskDesc} onChange={e => setTaskDesc(e.target.value)}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assign To</label>
                                <select className="form-input" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} required>
                                    <option value="">Select a user</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Due Date</label>
                                <input type="date" className="form-input" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
