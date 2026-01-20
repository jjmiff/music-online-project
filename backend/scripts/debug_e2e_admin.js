const db = require('../db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
    try {
        const unique = Date.now();
        const adminName = `debug_admin_${unique}`;
        const targetName = `target_user_${unique}`;

        console.log('--- 1. Creating Admin User ---');
        // We insert directly to DB to skip registration/hashing complexity for this test if possible,
        // BUT we need to login via API to get token. So we need valid hash.
        // Instead, let's Register via API then Update Role via DB.

        // Native fetch for registration
        const regRes = await fetch('http://127.0.0.1:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: adminName, email: `${adminName}@test.com`, password: 'password123' })
        });
        const regData = await regRes.json();
        const adminId = regData.userId;
        console.log(`Admin Registered ID: ${adminId}`);

        console.log('--- 2. Promoting to Admin ---');
        await db.query('UPDATE users SET role = "admin", status = "approved" WHERE id = ?', [adminId]);
        console.log('Role updated to admin.');

        console.log('--- 3. Logging In ---');
        const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: adminName, password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Token obtained.');

        console.log('--- 4. Creating Target User ---');
        const targetRes = await fetch('http://127.0.0.1:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: targetName, email: `${targetName}@test.com`, password: 'password123' })
        });
        const targetData = await targetRes.json();
        const targetId = targetData.userId;
        console.log(`Target User ID: ${targetId}`);

        console.log(`--- 5. Fetching Details for Target ID ${targetId} ---`);
        const detailRes = await fetch(`http://127.0.0.1:3000/api/admin/users/${targetId}/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log(`STATUS: ${detailRes.status}`);
        const text = await detailRes.text();
        console.log('BODY:', text);

        process.exit(0);
    } catch (e) {
        console.error('ERROR:', e);
        process.exit(1);
    }
}

run();
