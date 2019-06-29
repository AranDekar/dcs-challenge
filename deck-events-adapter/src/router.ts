import { Router, Request, Response } from 'express';
import getLogger from 'dcs-logger';
import handler from './handler';

const logger = getLogger();
const router: Router = Router();

router.post('/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    handler(id, (err, result) => {
        if (err) {
            logger.error('Error invalidating deck article: ', { id: id, err: err });
            return res.status(500).json({status: err.message});
        }
        res.json({status: 'OK'});
    });
});

export default router;
