import {Router} from 'express';
import { Request, Response } from 'express';
const router = Router();

router.get('/', function(req: Request, res:Response) {
    res.send('Estas en el index, dirijete a la ruta /users');
});

export default router;