const db = require('../db');
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'MusicOnline/1.0 (Integration Test; +http://localhost)'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                // If redirect, handle it (Wikimedia often redirects)
                if (res.statusCode === 301 || res.statusCode === 302) {
                    downloadImage(res.headers.location).then(resolve).catch(reject);
                    return;
                }
                reject(new Error(`Failed to download image: ${res.statusCode}`));
                return;
            }
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

async function processVinyls() {
    try {
        console.log('Starting migration...');

        // Fetch all vinyls with external URLs
        const [vinyls] = await db.query('SELECT id, title, image_url FROM vinyls WHERE image_url LIKE "http%" AND image_url NOT LIKE "%localhost%"');

        console.log(`Found ${vinyls.length} vinyls to migrate.`);

        for (const vinyl of vinyls) {
            console.log(`Processing: ${vinyl.title} (${vinyl.id})`);

            try {
                const buffer = await downloadImage(vinyl.image_url);

                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filenameBase = 'vinyl-migrated-' + uniqueSuffix;
                const largeFilename = filenameBase + '-large.webp';
                const thumbFilename = filenameBase + '-thumb.webp';

                // Generate Large
                await sharp(buffer)
                    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(path.join(UPLOADS_DIR, largeFilename));

                // Generate Thumb
                await sharp(buffer)
                    .resize(400, 400, { fit: 'cover' })
                    .webp({ quality: 80 })
                    .toFile(path.join(UPLOADS_DIR, thumbFilename));

                // Update DB with local path (large version, frontend handles thumb logic)
                const newPath = `/uploads/${largeFilename}`;
                await db.query('UPDATE vinyls SET image_url = ? WHERE id = ?', [newPath, vinyl.id]);

                console.log(`  -> Migrated to ${newPath}`);

            } catch (err) {
                console.error(`  -> Failed to migrate vinyl ${vinyl.id}:`, err.message);
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

processVinyls();
