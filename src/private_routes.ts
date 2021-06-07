/**
 * Pivate Routes are those API urls that require the user to be
 * logged in before they can be called from the front end.
 * 
 * Basically all HTTP requests to these endpoints must have an
 * ader with the value "Bearer <token>"
 * being "<token>" a JWT token generated for the user using 
 * the POST /token endpoint
 * 
 * Please include in this file all your private URL endpoints.
 * 
 */

import { Router, Request, Response, NextFunction } from 'express';
import { safe } from './utils';
import jwt from 'jsonwebtoken'
import * as actions from './actions';

// declare a new router to include all the endpoints
const router = Router();

//middleware de verificación
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    //headers con el token
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ 'message': 'ACCESS DENIED' });

    const decoded = jwt.verify(token as string, process.env.JWT_KEY as string);
    req.user = decoded;

    next();
}

// router.get('/user', safe(actions.getUsers));
//PUBLICAR
router.post('/usuarios/publicar',verifyToken, safe(actions.crearPublicacion));
//PUBLICACIONES DE UN USUARIO
router.get('/usuarios/publicaciones',verifyToken, safe(actions.getPublicacionesUsuario));

export default router;
