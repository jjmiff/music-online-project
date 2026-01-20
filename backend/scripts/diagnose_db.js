const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const configs = [
    { host: '127.0.0.1', user: 'root', password: '', database: 'music-onlineV2' },
    { host: 'localhost', user: 'root', password: '', database: 'music-onlineV2' },
    { host: '::1', user: 'root', password: '', database: 'music-onlineV2' }
];

async function testConnections() {
    console.log('Starting DB Connection Diagnostics...');
    console.log('Env Host:', process.env.DB_HOST);

    for (const config of configs) {
        console.log(`\nTesting connection to host: [${config.host}]...`);
        try {
            const conn = await mysql.createConnection(config);
            console.log(`✅ SUCCESS connecting to ${config.host}`);
            const [rows] = await conn.query('SELECT 1 as val');
            console.log(`   Query result: ${rows[0].val}`);
            await conn.end();
            console.log('   Connection closed.');
        } catch (err) {
            console.log(`❌ FAILED connecting to ${config.host}`);
            console.log(`   Error: ${err.code} - ${err.message}`);
        }
    }
    process.exit(0);
}

testConnections();
