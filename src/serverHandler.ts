import {IncomingMessage, ServerResponse} from "http";
import {readFileSync} from "fs";

function getDataFromFile(fileName: string): any {
    const data = readFileSync(fileName, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.log('Error parsing JSON', err);
        return null;
    }
}

// TODO
// get rid of all elses

function getUsersHandler(res: ServerResponse) {
    const data = getDataFromFile('data.json');
    if (data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

export function serverHandler(req: IncomingMessage, res: ServerResponse) {
    if (req.url === '/users' && req.method === 'GET') {
        getUsersHandler(res);
    } else if (req.url === '/health' && req.method === 'GET') {
        getHealthHandler(res);
    } else if (req.url && req.url.startsWith('/users/') && req.method === 'GET') {
        getUserByIdHandler(req, res);
    } else {
        NotFoundHandler(res);
    }
}

function NotFoundHandler(res: ServerResponse<IncomingMessage>) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
}

function getUserByIdHandler(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
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
}

function getHealthHandler(res: ServerResponse<IncomingMessage>) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
}
