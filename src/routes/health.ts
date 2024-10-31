import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/', (req, res) => {
    res.status(200).send('OK');
});

export default healthRouter;