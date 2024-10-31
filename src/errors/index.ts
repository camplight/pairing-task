export class JSONParseException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JSONParseException';
    }
}