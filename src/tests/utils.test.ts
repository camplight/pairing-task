import { JSONParseException } from '../errors';
import { getDataFromFile } from '../utils/getDataFromFile';

describe('getDataFromFile', () => {
    test('should return user data from a valid JSON file', () => {
        const fileName = './src/tests/testData.json';
        const expectedData = {
            users: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' }
            ]
        };

        const data = getDataFromFile(fileName);
        expect(data).toEqual(expectedData);
    });

    test('should throw JSONParseException for an invalid JSON file', () => {
        const fileName = './src/tests/invalidData.json';

        expect(() => getDataFromFile(fileName)).toThrow(JSONParseException);
    });

    test('should throw error if file does not exist', () => {
        const fileName = './src/tests/nonExistentFile.json';

        expect(() => getDataFromFile(fileName)).toThrow();
    });
});
