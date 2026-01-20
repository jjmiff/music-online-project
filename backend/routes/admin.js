const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to ensure admin
const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

router.use(authMiddleware);
router.use(adminCheck);

// Get Single User Details & Inventory Stats
// Placed at top to avoid routing conflicts
router.get('/users/:id/details', async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Get User Profile
        const [userRows] = await db.query('SELECT id, username, email, role, status FROM users WHERE id = ?', [userId]);

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userProfile = userRows[0];

        // 2. Get Vinyl Inventory
        const [vinylRows] = await db.query('SELECT * FROM vinyls WHERE seller_id = ?', [userId]);

        // 3. Calculate Stats
        const totalValue = vinylRows.reduce((sum, v) => sum + Number(v.price), 0);
        const approvedCount = vinylRows.filter(v => v.status === 'approved').length;
        const pendingCount = vinylRows.filter(v => v.status === 'pending').length;

        res.json({
            user: userProfile,
            inventory: vinylRows,
            stats: {
                totalValue: totalValue.toFixed(2),
                totalItems: vinylRows.length,
                approvedItems: approvedCount,
                pendingItems: pendingCount
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get All Users (with filter)
router.get('/users', async (req, res) => {
    const { status } = req.query;
    let query = 'SELECT id, username, email, role, status, created_at FROM users';
    let params = [];

    if (status) {
        query += ' WHERE status = ?';
        params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    try {
        const [users] = await db.query(query, params);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get Pending Vinyls
router.get('/vinyls', async (req, res) => {
    const { status } = req.query; // 'pending', 'approved', 'rejected' or null for all
    let query = 'SELECT * FROM vinyls';
    const params = [];

    if (status) {
        query += ' WHERE status = ?';
        params.push(status);
    } else {
        // Default to showing all if no filter, or maybe pending? Let's just default all for admin view
    }
    query += ' ORDER BY created_at DESC';

    try {
        const [vinyls] = await db.query(query, params);
        res.json(vinyls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching vinyls' });
    }
});

// Approve/Reject User
router.put('/users/:id/:action', async (req, res) => {
    const { id, action } = req.params; // action: 'approve' | 'reject'
    const status = action === 'approve' ? 'approved' : 'rejected';

    try {
        await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `User ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Approve/Reject Vinyl
router.put('/vinyls/:id/:action', async (req, res) => {
    const { id, action } = req.params;
    const status = action === 'approve' ? 'approved' : 'rejected';

    try {
        await db.query('UPDATE vinyls SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Vinyl ${status}` });
    } catch (error) {
        res.status(500).json({ error: 'Error updating vinyl' });
    }
});

// Get Activity Log (Real + Mock Sales)
router.get('/activity', async (req, res) => {
    // The authMiddleware and adminCheck middleware already handle authorization
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ error: 'Unauthorized' });
    // }

    try {
        // 1. Get recent users (Real)
        const [recentUsers] = await db.query('SELECT username, created_at FROM users ORDER BY created_at DESC LIMIT 5');

        // 2. Get recent vinyls (Real)
        const [recentVinyls] = await db.query('SELECT title, price, created_at, seller_id FROM vinyls ORDER BY created_at DESC LIMIT 5');

        // 3. Mock Sales (Simulated for Prototype)
        // We pretend some approved vinyls were sold recently
        const [mockSales] = await db.query('SELECT title, price, seller_id FROM vinyls WHERE status = "approved" LIMIT 3');

        const logs = [];

        // Map Real Events
        recentUsers.forEach(u => logs.push({
            type: 'USER_JOINED',
            message: `New user registered: ${u.username}`,
            date: u.created_at
        }));

        recentVinyls.forEach(v => logs.push({
            type: 'VINYL_ADDED',
            message: `New listing: "${v.title}" (£${v.price})`,
            date: v.created_at
        }));

        // Map Mock Sales (random times in last 24h)
        mockSales.forEach((v, i) => {
            const mockDate = new Date();
            mockDate.setHours(mockDate.getHours() - (i * 2 + 1)); // Stagger timestamps
            logs.push({
                type: 'SALE',
                message: `SALE: "${v.title}" sold for £${v.price}`,
                date: mockDate
            });
        });

        // Sort by date desc
        logs.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(logs);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Search Analytics
router.get('/analytics/search', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const [rows] = await db.query('SELECT term, search_count, last_searched_at FROM search_logs ORDER BY search_count DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching search analytics:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
