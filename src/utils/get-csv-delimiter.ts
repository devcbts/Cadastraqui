const readline = require('readline')
import fs from 'fs';
export default async function getDelimiter(path: string) {
    let line = '';
    const readable = fs.createReadStream(path);
    const reader = readline.createInterface({ input: readable });
    line = await new Promise((resolve) => {
        reader.on('line', (line: string) => {
            reader.close();
            resolve(line);
        });
    });
    readable.close();
    const validDelimiters = [',', ';']
    for (const x of validDelimiters) {
        const len = line.split(x).length
        console.log(x, len)
        if (len > 1) {
            return x
        }
    }
}