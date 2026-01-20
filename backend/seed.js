const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'music-onlineV2'
        });

        const users = [
            { username: 'user1', email: 'user1@example.com', password: 'password123', role: 'user' },
            { username: 'user2', email: 'user2@example.com', password: 'password123', role: 'user' },
            { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' }
        ];

        console.log('Seeding users...');

        for (const user of users) {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [user.email]);
            if (rows.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                await pool.query(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    [user.username, user.email, hashedPassword, user.role]
                );
                console.log(`Created user: ${user.username}`);
            } else {
                console.log(`User already exists: ${user.username}`);
            }
        }

        console.log('Seeding completed.');
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
