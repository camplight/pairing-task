import { readFileSync } from 'fs';
import { JSONParseException } from '../errors';

interface UserData {
    users: Array<{ id: string; name: string }>;
}

export function getDataFromFile(fileName: string): UserData {
    const data = readFileSync(fileName, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err: any) {
        throw new JSONParseException(`Error parsing JSON from file ${fileName}: ${err.message}`);
    }
}