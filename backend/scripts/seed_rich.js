const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const images = [
    'https://placehold.co/600x600/1a1a1a/FFF?text=Pink+Floyd',
    'https://placehold.co/600x600/2a2a2a/FFF?text=Fleetwood+Mac',
    'https://placehold.co/600x600/333333/FFF?text=Nirvana',
    'https://placehold.co/600x600/111111/FFF?text=Radiohead',
    'https://placehold.co/600x600/000000/FFF?text=The+Beatles',
    'https://placehold.co/600x600/222222/FFF?text=Unknown+Artist',
    'https://placehold.co/600x600/1a1a1a/FFF?text=Indie+Band'
];

const descriptions = [
    "A masterpiece of psychedelic rock, featuring extended instrumentals and profound lyrics about the human condition.",
    "One of the best-selling albums of all time, known for its emotional lyrics and intricate harmonies born from band conflict.",
    "The album that defined a generation, bringing grunge to the mainstream with its raw energy and catchy hooks.",
    "A dystopian electronic rock opera that challenged the conventions of alternative music in the late 90s.",
    "A revolutionary album that changed the course of pop music with its experimental studio techniques and diverse songwriting."
];

async function seed() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'music-onlineV2'
        });

        console.log('Clearing existing data...');
        await pool.query('DELETE FROM vinyls');
        await pool.query('DELETE FROM users');

        console.log('Seeding users...');
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);
        const adminPassword = await bcrypt.hash('admin123', salt);

        // 1. Admin
        const [admin] = await pool.query(
            'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            ['admin', 'admin@example.com', adminPassword, 'admin', 'approved']
        );

        // 2. Approved Seller
        const [sellerApp] = await pool.query(
            'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            ['seller_approved', 'seller@example.com', password, 'user', 'approved']
        );

        // 3. Pending Seller
        const [sellerPend] = await pool.query(
            'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            ['seller_pending', 'pending@example.com', password, 'user', 'pending']
        );

        // 4. Buyer
        await pool.query(
            'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            ['buyer', 'buyer@example.com', password, 'user', 'approved']
        );

        console.log('Seeding vinyls...');
        const approvedId = sellerApp.insertId;
        const pendingId = sellerPend.insertId;

        // Approved Vinyls (5 items)
        const vinyls = [
            { title: 'Dark Side of the Moon', artist: 'Pink Floyd', type: 'album', price: 25.00, image_url: images[0], desc: descriptions[0] },
            { title: 'Rumours', artist: 'Fleetwood Mac', type: 'album', price: 20.00, image_url: images[1], desc: descriptions[1] },
            { title: 'Nevermind', artist: 'Nirvana', type: 'album', price: 30.00, image_url: images[2], desc: descriptions[2] },
            { title: 'OK Computer', artist: 'Radiohead', type: 'album', price: 22.50, image_url: images[3], desc: descriptions[3] },
            { title: 'Abbey Road', artist: 'The Beatles', type: 'album', price: 35.00, image_url: images[4], desc: descriptions[4] }
        ];

        for (const v of vinyls) {
            await pool.query(
                'INSERT INTO vinyls (title, artist, type, description, price, release_date, image_url, seller_id, status) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
                [v.title, v.artist, v.type, v.desc, v.price, v.image_url, approvedId, 'approved']
            );
        }

        // Pending Vinyls (2 items)
        await pool.query(
            'INSERT INTO vinyls (title, artist, type, description, price, release_date, image_url, seller_id, status) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
            ['Garage Demos', 'Unknown Artist', 'ep', 'Raw recordings from the garage.', 10.00, images[5], pendingId, 'pending']
        );
        await pool.query(
            'INSERT INTO vinyls (title, artist, type, description, price, release_date, image_url, seller_id, status) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)',
            ['Summer Vibes', 'Indie Band', 'single', 'The hit single of the summer.', 5.00, images[6], approvedId, 'pending']
        );

        console.log('Rich seed completed successfully.');
        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
