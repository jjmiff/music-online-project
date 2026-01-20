const db = require('../db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkContent() {
    try {
        console.log('Checking vinyls count...');
        const [rows] = await db.query('SELECT COUNT(*) as count FROM vinyls');
        console.log(`Vinyl count: ${rows[0].count}`);

        // Check Users
        const [users] = await db.query('SELECT id, username, status FROM users');
        console.log('Users found:', users);

        // Check Vinyl Images
        const [vinyls] = await db.query('SELECT id, title, image_url FROM vinyls');
        console.log('Vinyl Images:', JSON.stringify(vinyls, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error.message);
        process.exit(1);
    }
}

checkContent();
