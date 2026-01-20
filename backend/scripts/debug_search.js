const db = require('../db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
    try {
        console.log('Searching DB for "pink"...');
        const query = 'SELECT * FROM vinyls WHERE (title LIKE ? OR artist LIKE ?)';
        const [rows] = await db.query(query, ['%pink%', '%pink%']);

        console.log('Results Found:', rows.length);
        rows.forEach(v => {
            console.log(`- ID: ${v.id} | Title: "${v.title}" | Artist: "${v.artist}"`);
        });

        console.log('\n--- Checking for Abbey Road ---');
        const [abbey] = await db.query('SELECT * FROM vinyls WHERE title = "Abbey Road"');
        if (abbey.length) {
            console.log(`Abbey Road ID: ${abbey[0].id}`);
        } else {
            console.log('Abbey Road not found in DB.');
        }

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

check();
