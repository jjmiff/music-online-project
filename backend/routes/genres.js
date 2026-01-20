const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/genres - Public
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM genres ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/genres - Admin Only
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        await db.query('INSERT INTO genres (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Genre added' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Genre already exists' });
        }
        console.error('Error adding genre:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/genres/:id - Admin Only
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        await db.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
        res.json({ message: 'Genre deleted' });
    } catch (error) {
        console.error('Error deleting genre:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
