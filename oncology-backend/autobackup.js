const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

function performBackup() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const fileName = `oncology_backup_${dateStr}.sql`;
    const filePath = path.join(BACKUP_DIR, fileName);

    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || 'admin';
    const database = process.env.DB_NAME || 'oncology_db';

    // Requires mysqldump in PATH
    const command = `mysqldump -h ${host} -u ${user} -p${password} ${database} > "${filePath}"`;

    console.log(`[Auto-Backup] Starting database backup: ${fileName}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Auto-Backup] Error during backup: ${error.message}`);
            return;
        }
        console.log(`[Auto-Backup] Successfully backed up to ${filePath}`);
    });
}

function startAutoBackup() {
    let lastBackupDate = null;
    
    // Check every hour
    setInterval(() => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        
        // Backup at 2 AM every day
        if (now.getHours() === 2 && lastBackupDate !== currentDate) {
            performBackup();
            lastBackupDate = currentDate;
        }
    }, 60 * 60 * 1000); 

    // Initial check on startup just to log that it's active
    console.log('[Auto-Backup] Backup system initialized. Next backup scheduled at 2:00 AM.');
}

module.exports = { startAutoBackup, performBackup };
