const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

// Vercel has a read-only filesystem, so we MUST use an in-memory database there.
// Locally and on Railway, we will use the persistent database.sqlite file.
const db = process.env.VERCEL ? new sqlite3.Database(':memory:') : new sqlite3.Database(dbPath);

db.serialize(() => {
    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON;', (err) => {
        if (err) console.error('Error enabling foreign keys:', err);
    });

    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'Member'
    )`);

    // Create Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        title TEXT,
        description TEXT,
        assigned_to INTEGER,
        status TEXT DEFAULT 'Pending',
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id)
    )`);
});

module.exports = db;
