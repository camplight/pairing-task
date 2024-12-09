import { readFileSync } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const port = 3000;

function getDataFromFile(fileName: string): any {
    const data = readFileSync(fileName, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.log('Error parsing JSON', err);
        return null;
    }
}

createServer(function (req: IncomingMessage, res: ServerResponse) {
    if (req.url === '/users' && req.method === 'GET') {
        const data = getDataFromFile('data.json');
        if (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else if (req.url && req.url.startsWith('/users/') && req.method === 'GET') {
        const id = req.url.split('/')[2];
        const data = getDataFromFile('data.json');
        if (data && data.users) {
            const user = data.users.find((u: any) => u.id == id);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
            }
        } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}).listen(port);

console.log(`Server listening on port ${port}`);
