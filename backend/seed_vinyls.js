const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const vinyls = [
    {
        title: 'Abbey Road',
        artist: 'The Beatles',
        type: 'album',
        description: 'The eleventh studio album by the English rock band the Beatles.',
        price: 29.99,
        release_date: '1969-09-26',
        image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Beatles_-_Abbey_Road.jpg'
    },
    {
        title: 'Dark Side of the Moon',
        artist: 'Pink Floyd',
        type: 'album',
        description: 'The eighth studio album by the English rock band Pink Floyd.',
        price: 34.50,
        release_date: '1973-03-01',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png'
    },
    {
        title: 'Thriller',
        artist: 'Michael Jackson',
        type: 'album',
        description: 'The sixth studio album by American singer Michael Jackson.',
        price: 25.00,
        release_date: '1982-11-29',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png'
    },
    {
        title: 'Rumours',
        artist: 'Fleetwood Mac',
        type: 'album',
        description: 'The eleventh studio album by British-American rock band Fleetwood Mac.',
        price: 28.99,
        release_date: '1977-02-04',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG'
    },
    {
        title: 'Hotel California',
        artist: 'Eagles',
        type: 'single',
        description: 'A song by the American rock band Eagles.',
        price: 12.99,
        release_date: '1977-02-22',
        image_url: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg'
    }
];

async function seedVinyls() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'music-onlineV2'
        });

        console.log('Connected to database.');

        // Get a user to assign these vinyls to (e.g., user1)
        const [users] = await connection.query('SELECT id FROM users WHERE username = ?', ['user1']);

        // Fallback to any user if user1 doesn't exist, or create one if none exist
        let sellerId;
        if (users.length > 0) {
            sellerId = users[0].id;
        } else {
            const [allUsers] = await connection.query('SELECT id FROM users LIMIT 1');
            if (allUsers.length > 0) {
                sellerId = allUsers[0].id;
            } else {
                console.log("No users found. Please run user seed first.");
                process.exit(1);
            }
        }

        console.log(`Seeding vinyls for seller ID: ${sellerId}...`);

        // Clear existing vinyls to avoid duplicates and broken links
        await connection.query('DELETE FROM vinyls');
        console.log('Cleared existing vinyls.');

        for (const vinyl of vinyls) {
            await connection.query(
                'INSERT INTO vinyls (title, artist, type, description, price, release_date, image_url, seller_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [vinyl.title, vinyl.artist, vinyl.type, vinyl.description, vinyl.price, vinyl.release_date, vinyl.image_url, sellerId]
            );
        }

        console.log('Vinyls seeded successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding vinyls:', error);
        process.exit(1);
    }
}

seedVinyls();
