const express = require('express');
const db = require('../database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);

// Get all projects
router.get('/', (req, res) => {
    db.all('SELECT * FROM projects ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Create a project (Admin only)
router.post('/', authorizeAdmin, (req, res) => {
    const { name, description } = req.body;
    
    if (!name) return res.status(400).json({ error: 'Project name is required' });

    db.run('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'Project created successfully', id: this.lastID });
    });
});

// Get a single project with its tasks
router.get('/:id', (req, res) => {
    const projectId = req.params.id;
    db.get('SELECT * FROM projects WHERE id = ?', [projectId], (err, project) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        db.all('SELECT tasks.*, users.username as assigned_to_username FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id WHERE project_id = ?', [projectId], (err, tasks) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ ...project, tasks });
        });
    });
});

// Delete project (Admin only)
router.delete('/:id', authorizeAdmin, (req, res) => {
    const projectId = req.params.id;
    db.run('DELETE FROM projects WHERE id = ?', [projectId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        db.run('DELETE FROM tasks WHERE project_id = ?', [projectId]); // Cascade delete tasks
        res.json({ message: 'Project deleted successfully' });
    });
});

module.exports = router;
