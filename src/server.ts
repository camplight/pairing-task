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

function respondWithHealthCheck(res: ServerResponse<IncomingMessage>) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
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

    if (requestUrl.startsWith('/users')) {
        if (requestUrl === '/users') {
            if (data) {
                return respondWithData(res, data);
            }

            return respondWithError(res, 500, 'Internal Server Error');
        }

        if (requestUrl.startsWith('/users/')) {
            if (data && data.users) {
                const id = requestUrl.split('/')[2];
                const user = data.users.find((u: any) => u.id == id);
                if (user) {
                    return respondWithData(res, user);
                }
                return respondWithError(res, 404, 'User not found');
            }
            return respondWithError(res, 500, 'Internal Server Error');
        }
    }

    if (requestUrl === '/health') {
        return respondWithHealthCheck(res);
    }

    respondWithError(res, 404, 'Not Found');
}
