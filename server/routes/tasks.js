const express = require('express');
const db = require('../database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Get all tasks (Dashboard)
router.get('/', (req, res) => {
    let query = 'SELECT tasks.*, projects.name as project_name, users.username as assigned_to_username FROM tasks LEFT JOIN projects ON tasks.project_id = projects.id LEFT JOIN users ON tasks.assigned_to = users.id';
    const params = [];

    // If user is not admin, only show their tasks
    if (req.user.role !== 'Admin') {
        query += ' WHERE tasks.assigned_to = ?';
        params.push(req.user.id);
    }
    query += ' ORDER BY due_date ASC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Create a task (Admin only)
router.post('/', authorizeAdmin, (req, res) => {
    const { project_id, title, description, assigned_to, status, due_date } = req.body;
    
    if (!project_id || !title) return res.status(400).json({ error: 'Project ID and title are required' });

    db.run('INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?, ?)', 
        [project_id, title, description, assigned_to, status || 'Pending', due_date], 
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Task created successfully', id: this.lastID });
        }
    );
});

// Update a task (Members can update status, Admin can update all)
router.put('/:id', (req, res) => {
    const taskId = req.params.id;
    const { status, title, description, assigned_to, due_date } = req.body;

    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (req.user.role !== 'Admin' && task.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Access denied. You can only update your assigned tasks.' });
        }

        if (req.user.role === 'Admin') {
            db.run('UPDATE tasks SET title = ?, description = ?, assigned_to = ?, status = ?, due_date = ? WHERE id = ?',
                [title || task.title, description || task.description, assigned_to || task.assigned_to, status || task.status, due_date || task.due_date, taskId],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.json({ message: 'Task updated successfully' });
                }
            );
        } else {
            // Member can only update status
            db.run('UPDATE tasks SET status = ? WHERE id = ?', [status || task.status, taskId], function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ message: 'Task status updated successfully' });
            });
        }
    });
});

// Delete task (Admin only)
router.delete('/:id', authorizeAdmin, (req, res) => {
    const taskId = req.params.id;
    db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
