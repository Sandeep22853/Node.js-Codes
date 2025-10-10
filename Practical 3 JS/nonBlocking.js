const fs = require('fs');

fs.readFile('Blocking.txt', 'utf-8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Non-blocking read:", data);
});

console.log("This line runs before file is read!");