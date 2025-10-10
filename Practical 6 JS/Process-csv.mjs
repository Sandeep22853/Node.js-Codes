import { createReadStream, createWriteStream, promises as fs } from 'fs';
import { createInterface } from 'readline';
import { pipeline, Transform } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

class DomainCounter extends Transform {
    constructor(options) {
        super({ ...options, objectMode: true });
        this.domainCounts = new Map();
    }

    _transform(line, encoding, callback) {
       
        const columns = line.split(',');
        if (columns.length >= 3) {
            const email = columns[2].trim();
            const domain = email.substring(email.lastIndexOf('@') + 1);
            if (domain) {
                this.domainCounts.set(domain, (this.domainCounts.get(domain) || 0) + 1);
            }
        }
        callback();
    }
}

async function processCSV() {
    console.log('Starting CSV processing...');
    const sourcePath = 'data/users.csv';
    const outputPath = 'out/domains.json';

    await fs.mkdir('out', { recursive: true });

    const sourceStream = createReadStream(sourcePath);
    const lineReader = createInterface({
        input: sourceStream,
        crlfDelay: Infinity
    });

    const domainCounter = new DomainCounter();

    try {
        await pipelineAsync(
            lineReader,
            domainCounter
        );

        const sortedDomains = [...domainCounter.domainCounts.entries()]
            .sort((a, b) => b[1] - a[1]);

        const jsonOutput = JSON.stringify(Object.fromEntries(sortedDomains), null, 2);

        await fs.writeFile(outputPath, jsonOutput);

        console.log(`✅ CSV processing complete. Results saved to ${outputPath}`);
        return {
            totalDomains: domainCounter.domainCounts.size,
            topDomain: sortedDomains[0]
        };
    } catch (err) {
        console.error('🚨 Pipeline failed:', err);
        throw err;
    }
}

export { processCSV };