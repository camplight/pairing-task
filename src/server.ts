import {IncomingMessage, ServerResponse} from "http";
import {getDataFromFile, respondWithData, respondWithError, respondWithHealthCheck} from "./serverHelpers";

export function serverFunction(req: IncomingMessage, res: ServerResponse, data: any = getDataFromFile('data.json')) {
    if (req.method !== 'GET') {
        return respondWithError(res, 404, 'Not Found');
    }

    const requestUrl = req.url;
    if (!requestUrl) {
        return respondWithError(res, 404, 'Not Found');
    }

    if (requestUrl.startsWith('/users')) {
        if (!(data && data.users)) {
            return respondWithError(res, 500, 'Internal Server Error');
        }

        if (requestUrl === '/users') {
            return respondWithData(res, data);
        }

        if (requestUrl.startsWith('/users/')) {
            const id = requestUrl.split('/')[2];
            const user = data.users.find((u: any) => u.id == id);
            if (user) {
                return respondWithData(res, user);
            }
            return respondWithError(res, 404, 'User not found');
        }
    }

    if (requestUrl === '/health') {
        return respondWithHealthCheck(res);
    }

    respondWithError(res, 404, 'Not Found');
}
