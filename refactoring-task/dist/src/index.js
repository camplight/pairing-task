"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverFunction = serverFunction;
const fs_1 = require("fs");
const http_1 = require("http");
const port = 3000;
function getDataFromFile(fileName) {
    const data = (0, fs_1.readFileSync)(fileName, 'utf8');
    try {
        return JSON.parse(data);
    }
    catch (err) {
        console.log('Error parsing JSON', err);
        return null;
    }
}
(0, http_1.createServer)(serverFunction).listen(port);
function serverFunction(req, res) {
    if (req.url === '/users' && req.method === 'GET') {
        const data = getDataFromFile('data.json');
        if (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
    else if (req.url === '/health' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    }
    else if (req.url && req.url.startsWith('/users/') && req.method === 'GET') {
        const id = req.url.split('/')[2];
        const data = getDataFromFile('data.json');
        if (data && data.users) {
            const user = data.users.find((u) => u.id == id);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
            }
        }
        else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}
console.log(`Server listening on port ${port}`);
