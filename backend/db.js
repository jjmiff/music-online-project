const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

console.log('Initializing DB Pool with host: 127.0.0.1');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'music-onlineV2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
