
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 * 
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
import { Router } from 'express';
import { safe } from './utils';
import * as actions from './actions';
import { enviarMail } from './email/controlador';

const router = Router();

// signup route, creates a new user in the DB
// router.post('/user', safe(createUser));

// LOGIN 
router.post('/login', safe(actions.login));
//REGISTRO
router.post('/registro',safe(actions.crearUsuario));

//TRAER USUARIO
router.get('/usuarios',safe(actions.getUSuarios));

router.post('/email', safe(enviarMail))
export default router;
