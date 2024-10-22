import {createServer} from 'http';
import {serverHandler} from "./serverHandler";

// TODO
// 0. tech stack confirmation
// 1. test coverage
// 2. refactor without fear of breaking stuff
// 

const port = 3000;

createServer(serverHandler).listen(port);

console.log(`Server listening on port ${port}`);
