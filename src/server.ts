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

function respondWithData(res: ServerResponse, data: any) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

function respondWithError(res: ServerResponse<IncomingMessage>, code: number, message: string) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(message);
}

export function serverFunction(req: IncomingMessage, res: ServerResponse, data: any = getDataFromFile('data.json')) {
    if (req.method !== 'GET') {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
        return;
    }

    let requestUrl = req.url;
    if (!requestUrl) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
        return;
    }

    if (requestUrl === '/users') {
        if (data) {
            respondWithData(res, data);
        } else {
            respondWithError(res, 500, 'Internal Server Error');
        }
        return;
    }

    if (requestUrl === '/health') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
        return;
    }

    if (requestUrl.startsWith('/users/')) {
        if (data && data.users) {
            const id = requestUrl.split('/')[2];
            const user = data.users.find((u: any) => u.id == id);
            if (user) {
                respondWithData(res, user);
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('User not found');
            }
        } else {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
        }
        return;
    }

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
}
