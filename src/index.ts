import { getDataFromFile } from './utils/getDataFromFile';
import { initServer } from './utils/initServer';

const port = 3000; //TODO: Low priority - extract as an env var

initServer(port)

console.log(`Server listening on port ${port}`);
