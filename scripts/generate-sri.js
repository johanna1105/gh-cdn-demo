// scripts/generate-sri.js
const fs = require('fs');
const crypto = require('crypto');
const file = process.argv[2];
if(!file){ console.error('Usage: node generate-sri.js <file>'); process.exit(1); }
const b = fs.readFileSync(file);
const h = crypto.createHash('sha384').update(b).digest('base64');
console.log('sha384-' + h);
