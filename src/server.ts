import {IncomingMessage, ServerResponse} from "http";
import {readFileSync} from "fs";

export function getDataFromFile(fileName: string): any {
    const data = readFileSync(fileName, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        console.log('Error parsing JSON', err);
        return null;
    }
}

export function serverFunction(req: IncomingMessage, res: ServerResponse, data: any = getDataFromFile('data.json')) {
    if (req.method === 'GET') {
        if (req.url === '/users') {
            if (data) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            } else {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
            }
        } else {
            if (req.url === '/health') {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('OK');
            } else {
                if (req.url && req.url.startsWith('/users/')) {
                    const id = req.url.split('/')[2];
                    if (data && data.users) {
                        const user = data.users.find((u: any) => u.id == id);
                        if (user) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(user));
                        } else {
                            res.writeHead(404, {'Content-Type': 'text/plain'});
                            res.end('User not found');
                        }
                    } else {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end('Internal Server Error');
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('Not Found');
                }
            }
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
}
