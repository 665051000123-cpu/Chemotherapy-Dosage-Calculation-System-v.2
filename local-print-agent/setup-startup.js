const fs = require('fs');
const path = require('path');
const os = require('os');

// Path to the Windows Startup folder
const startupDir = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');

// Path to the agent.js script in the current directory
const agentPath = path.join(__dirname, 'agent.js');

// Create the Batch file content to run Node minimized
const batContent = '@echo off\r\n' +
                   'cd /d "' + __dirname + '"\r\n' +
                   'start "Oncology Print Agent" /min node agent.js\r\n' +
                   'exit';

// Output file path
const batPath = path.join(startupDir, 'OncologyPrintAgent.bat');

try {
    // ลบไฟล์ VBS เก่าถ้ามีอยู่
    const oldVbsPath = path.join(startupDir, 'OncologyPrintAgent.vbs');
    if (fs.existsSync(oldVbsPath)) {
        fs.unlinkSync(oldVbsPath);
    }

    fs.writeFileSync(batPath, batContent);
    console.log('====================================================');
    console.log('✅ ตั้งค่าการเปิดอัตโนมัติสำเร็จแล้ว!');
    console.log('====================================================');
    console.log('โปรแกรม Local Print Agent จะทำงานแบบย่อหน้าต่างอยู่ด้านล่าง');
    console.log('ทุกครั้งที่คุณเปิดคอมพิวเตอร์เครื่องนี้ขึ้นมาครับ');
    console.log('');
    console.log('ตำแหน่งไฟล์ตั้งค่า: ' + batPath);
    console.log('====================================================');
} catch (err) {
    console.error('❌ เกิดข้อผิดพลาดในการตั้งค่า:', err);
}
