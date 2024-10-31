import express, { Request, Response, NextFunction } from 'express';
import { getDataFromFile } from './getDataFromFile';
import healthRouter from '../routes/health';
import usersRouter from '../routes/users';

export function initServer(port: number) {
    const app = express();

    app.use('/health', healthRouter);
    app.use('/users', usersRouter);

    // Handle unmatched routes
    app.use((req, res) => {
        res.status(404).send('Not Found');
    });

    // Global custom error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong!');
    });

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    return { app, server };
}
