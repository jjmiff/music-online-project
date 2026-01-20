const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    console.log('Starting migration...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        await connection.query(`USE \`music-onlineV2\``);

        // Add status to users
        console.log('Adding status to users table...');
        try {
            await connection.query(`
                ALTER TABLE users 
                ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
            `);
            // Update existing users to approved
            await connection.query(`UPDATE users SET status = 'approved'`);
            console.log('Users table updated.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column status already exists in users.');
            } else {
                throw e;
            }
        }

        // Add status to vinyls
        console.log('Adding status to vinyls table...');
        try {
            await connection.query(`
                ALTER TABLE vinyls 
                ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
            `);
            // Update existing vinyls to approved
            await connection.query(`UPDATE vinyls SET status = 'approved'`);
            console.log('Vinyls table updated.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column status already exists in vinyls.');
            } else {
                throw e;
            }
        }

        await connection.end();
        console.log('Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
