import {createServer} from 'http';
import {serverFunction} from "./server";

const port = 3000;

createServer(serverFunction).listen(port);

console.log(`Server listening on port ${port}`);
