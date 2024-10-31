// src/routes/users.routes.ts
import { Router } from 'express';
import { getDataFromFile } from '../utils/getDataFromFile';

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
    const data = getDataFromFile('data.json');
    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).send('Internal Server Error');
    }
});

usersRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    const data = getDataFromFile('data.json');
    if (data && data.users) {
        const user = data.users.find((u: any) => u.id == id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send('User not found');
        }
    } else {
        res.status(500).send('Internal Server Error');
    }
});

export default usersRouter;
