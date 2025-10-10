const fs = require('fs');

const data = fs.readFileSync('Blocking.txt', 'utf-8');
console.log("Blocking read:", data);