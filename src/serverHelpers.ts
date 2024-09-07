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

export function respondWithData(res: ServerResponse, data: any) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
}

export function respondWithError(res: ServerResponse<IncomingMessage>, code: number, message: string) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(message);
}

export function respondWithHealthCheck(res: ServerResponse<IncomingMessage>) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('OK');
}
