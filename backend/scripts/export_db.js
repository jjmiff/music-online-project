const db = require('../db');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const OUTPUT_FILE = path.join(__dirname, '../../sql/export.sql');

async function exportDatabase() {
    console.log('Starting DB Export...');
    try {
        const [tables] = await db.query('SHOW TABLES');
        let sqlDump = `-- Music Online Database Export\n-- Generated: ${new Date().toISOString()}\n\n`;

        for (const row of tables) {
            const tableName = Object.values(row)[0];
            console.log(`Exporting table: ${tableName}`);

            // Get Create Table
            const [createResult] = await db.query(`SHOW CREATE TABLE \`${tableName}\``);
            sqlDump += `-- Table structure for table \`${tableName}\`\n`;
            sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
            sqlDump += `${createResult[0]['Create Table']};\n\n`;

            // Get Data
            const [rows] = await db.query(`SELECT * FROM \`${tableName}\``);
            if (rows.length > 0) {
                sqlDump += `-- Dumping data for table \`${tableName}\`\n`;
                sqlDump += `INSERT INTO \`${tableName}\` VALUES\n`;

                const values = rows.map(row => {
                    const rowValues = Object.values(row).map(val => {
                        if (val === null) return 'NULL';
                        if (typeof val === 'number') return val;
                        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                        // Escape single quotes
                        return `'${String(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
                    });
                    return `(${rowValues.join(', ')})`;
                });

                sqlDump += values.join(',\n') + ';\n\n';
            }
        }

        // Ensure directory exists
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, sqlDump);
        console.log(`✅ Database exported successfully to: ${OUTPUT_FILE}`);
        process.exit(0);
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

exportDatabase();
