const db = require('../db');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const UPLOADS_DIR = path.join(__dirname, '../uploads');

async function restoreImages() {
    try {
        console.log('Restoring local images...');

        // 1. Get List of Files
        const files = fs.readdirSync(UPLOADS_DIR).filter(f => f.endsWith('-large.webp'));
        console.log(`Found ${files.length} large image files.`);

        if (files.length === 0) {
            console.log('No files to restore.');
            process.exit(0);
        }

        // 2. Get Vinyls
        const [vinyls] = await db.query('SELECT id, title FROM vinyls ORDER BY id ASC LIMIT ?', [files.length]);

        // 3. Map Files to Vinyls
        for (let i = 0; i < vinyls.length; i++) {
            const vinyl = vinyls[i];
            const file = files[i];
            const imageUrl = `/uploads/${file}`; // Relative path

            console.log(`Mapping "${vinyl.title}" -> ${imageUrl}`);
            await db.query('UPDATE vinyls SET image_url = ? WHERE id = ?', [imageUrl, vinyl.id]);
        }

        console.log('✅ Images restored successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Restore failed:', error);
        process.exit(1);
    }
}

restoreImages();
