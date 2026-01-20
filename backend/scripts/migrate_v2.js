const db = require('../db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    try {
        console.log('Starting Migration V2...');

        // 1. Create Genres Table
        /* 
           Industry Standard: "Normalization"
           Instead of repeating strings ('Rock', 'Rock', 'Rock'), we store them once here.
           (For this prototype, we keep the vinyls.genre column as string for simplicity, 
            but this table controls the ALLOWED list).
        */
        await db.query(`
            CREATE TABLE IF NOT EXISTS genres (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        console.log('✅ Table `genres` created.');

        // Seed Genres (if empty)
        const [existing] = await db.query('SELECT COUNT(*) as count FROM genres');
        if (existing[0].count === 0) {
            const initialGenres = ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'Country', 'Reggae'];
            for (const g of initialGenres) {
                await db.query('INSERT INTO genres (name) VALUES (?)', [g]);
            }
            console.log('🌱 Seeded initial genres.');
        }

        // 2. Create Search Logs Table
        /*
           Industry Standard: "Analytics"
           Companies pay millions for this data. We track what users want 
           so we can stock it (or sell the data).
        */
        await db.query(`
            CREATE TABLE IF NOT EXISTS search_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                term VARCHAR(255) NOT NULL,
                search_count INT DEFAULT 1,
                last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_term (term)
            )
        `);
        console.log('✅ Table `search_logs` created.');

        console.log('Migration V2 Complete!');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
