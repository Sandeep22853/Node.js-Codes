import http from 'http';
import { mkdir, writeFile } from 'fs/promises';

async function setup() {
    try {
        await mkdir('data', { recursive: true });
        await mkdir('out', { recursive: true });
        await mkdir('logs', { recursive: true });

        const indianNames = [
            'Priya Sharma', 'Rohan Gupta', 'Anjali Singh', 'Vikram Kumar', 'Sneha Patel',
            'Arjun Reddy', 'Meera Desai', 'Aditya Joshi', 'Pooja Mehta', 'Sameer Khan',
            'Kavita Rao', 'Rajesh Nair', 'Sunita Murthy', 'Deepak Iyer', 'Lakshmi Pillai'
        ];
        const csvContent = Array.from({ length: 5000 }, (_, i) => {
            const name = indianNames[i % indianNames.length];
            const emailName = name.toLowerCase().replace(' ', '.');
            const domain = ['example.com', 'test.org', 'sample.net', 'demo.co.uk', 'mail.io'][i % 5];
            return `${i + 1},${name},${emailName}.${i}@${domain}`;
        }).join('\n');
        await writeFile('data/users.csv', 'id,name,email\n' + csvContent);
        console.log('Setup complete. Dummy data generated.');
    } catch (err) {
        console.error('Error during setup:', err);
    }
}

await setup();


const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const { url, method } = req;
    console.log(`Received ${method} request for ${url}`);

    res.setHeader('Content-Type', 'application/json');

    switch (url) {
        case '/':
            res.writeHead(200);
            res.end(JSON.stringify({ message: 'Server is running. Visit /log or /process to trigger actions.' }));
            break;

        case '/log':
            try {
                const { default: logger } = await import('./logger.mjs');
                logger.info('This is an informational message from the /log endpoint.');
                logger.warn('This is a warning message.');
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Logs have been generated in the console and logs/server.log' }));
            } catch (error) {
                console.error('Failed to load or use logger:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Could not process logging.' }));
            }
            break;

        case '/process':
            try {
                const { processCSV } = await import('./process-csv.mjs');
                const result = await processCSV();
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'CSV processing initiated and completed.', result }));
            } catch (error) {
                console.error('Failed to process CSV:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Could not process CSV file.' }));
            }
            break;

        default:
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Not Found' }));
            break;
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  - /        : Home');
    console.log('  - /log     : Trigger the logger');
    console.log('  - /process : Trigger the CSV stream processing');
});