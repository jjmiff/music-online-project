const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'music-onlineV2'
        });

        const [rows] = await connection.query('SELECT * FROM users WHERE username = "admin"');
        console.log('Admin User:', rows);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
