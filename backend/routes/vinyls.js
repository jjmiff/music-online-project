const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Search Vinyls
router.get('/', async (req, res) => {
    const { q, type, minPrice, maxPrice, minYear, maxYear, sort } = req.query;
    let query = 'SELECT * FROM vinyls';
    const params = [];
    let conditions = ["status = 'approved'"];

    if (q) {
        conditions.push('(title LIKE ? OR artist LIKE ?)');
        params.push(`%${q}%`, `%${q}%`);

        // Search Analytics: Log this query silently
        // We use INSERT ... ON DUPLICATE KEY UPDATE to increment count
        db.query('INSERT INTO search_logs (term, search_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE search_count = search_count + 1', [q.toLowerCase()]).catch(err => console.error('Search Log Error:', err));
    }

    if (type) {
        conditions.push('type = ?');
        params.push(type);
    }

    if (minPrice) {
        conditions.push('price >= ?');
        params.push(minPrice);
    }

    if (maxPrice) {
        conditions.push('price <= ?');
        params.push(maxPrice);
    }

    if (minYear) {
        conditions.push('YEAR(release_date) >= ?');
        params.push(minYear);
    }

    if (maxYear) {
        conditions.push('YEAR(release_date) <= ?');
        params.push(maxYear);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    switch (sort) {
        case 'price_asc':
            query += ' ORDER BY price ASC';
            break;
        case 'price_desc':
            query += ' ORDER BY price DESC';
            break;
        case 'year_asc':
            query += ' ORDER BY release_date ASC';
            break;
        case 'year_desc':
            query += ' ORDER BY release_date DESC';
            break;
        default:
            query += ' ORDER BY created_at DESC';
            break;
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Server error during search' });
    }
});

// Get Vinyl Details
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT vinyls.*, users.username as seller_name FROM vinyls JOIN users ON vinyls.seller_id = users.id WHERE vinyls.id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Vinyl not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Get details error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add Vinyl (Protected)
router.post('/', authMiddleware, upload.single('image'), processImage, async (req, res) => {
    const { title, artist, type, description, price, release_date } = req.body;
    let image_url = req.body.image_url; // Fallback to URL if no file
    const seller_id = req.user.id;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    if (!title || !artist || !type) {
        return res.status(400).json({ error: 'Title, Artist, and Type are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO vinyls (title, artist, type, description, price, release_date, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, artist, type, description, price, release_date, image_url, seller_id]
        );
        res.status(201).json({ message: 'Vinyl added successfully', id: result.insertId });
    } catch (error) {
        console.error('Add vinyl error:', error);
        res.status(500).json({ error: 'Server error adding vinyl' });
    }
});

// Update Vinyl (Protected, Owner or Admin)
router.put('/:id', authMiddleware, upload.single('image'), processImage, async (req, res) => {
    const { id } = req.params;
    const { title, artist, type, description, price, release_date } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        // Check ownership
        const [existing] = await db.query('SELECT seller_id FROM vinyls WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Vinyl not found' });

        if (req.user.role !== 'admin' && existing[0].seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // If no new file and no new URL provided, keep existing image
        // (This logic assumes frontend sends current image_url if not changing, or we can handle partial updates)
        // Ideally, if image_url is undefined and req.file is undefined, we shouldn't overwrite it with NULL unless intentional.
        // For simplicity, let's dynamic query builder or careful SQL. 
        // Here, I will just re-use the update query but we should probably fetch the old image if new one isn't provided.
        // But for time saving, let's assume client sends the old URL back if they don't upload a new one.

        // Actually, if simply update without image, we should probably handle that.
        // Let's modify the query to update image_url only if it's provided (not undefined).
        // BUT, `image_url` comes from body. If file, we overwrite it.
        // If user DOESNT upload file, we expect `image_url` in body to be the old one or new string.

        await db.query(
            'UPDATE vinyls SET title = ?, artist = ?, type = ?, description = ?, price = ?, release_date = ?, image_url = COALESCE(?, image_url) WHERE id = ?',
            [title, artist, type, description, price, release_date, image_url || null, id]
        );
        res.json({ message: 'Vinyl updated successfully' });
    } catch (error) {
        console.error('Update vinyl error:', error);
        res.status(500).json({ error: 'Server error updating vinyl' });
    }
});

// Delete Vinyl (Protected, Owner or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        // Check ownership
        const [existing] = await db.query('SELECT seller_id FROM vinyls WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Vinyl not found' });

        if (req.user.role !== 'admin' && existing[0].seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await db.query('DELETE FROM vinyls WHERE id = ?', [id]);
        res.json({ message: 'Vinyl deleted successfully' });
    } catch (error) {
        console.error('Delete vinyl error:', error);
        res.status(500).json({ error: 'Server error deleting vinyl' });
    }
});

module.exports = router;
