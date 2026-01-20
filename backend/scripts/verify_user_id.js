const db = require('../db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        console.log('--- Fetching All Users ---');
        const [users] = await db.query('SELECT id, username FROM users');
        console.table(users);

        if (users.length > 0) {
            const testId = users[0].id;
            console.log(`\n--- Testing Detail Query for ID: ${testId} ---`);
            const [rows] = await db.query('SELECT id, username, email, role, status FROM users WHERE id = ?', [testId]);
            console.table(rows);

            if (rows.length === 0) {
                console.error('ALARM: User found in list but not in detail query!');
            } else {
                console.log('SUCCESS: Detail query returned data.');
            }
        } else {
            console.log('No users found in DB.');
        }

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

check();
