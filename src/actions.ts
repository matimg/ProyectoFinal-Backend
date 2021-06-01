import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Usuarios } from './entities/Usuarios'
import { Exception } from './utils'
import jwt from 'jsonwebtoken'

/*export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.first_name) throw new Exception("Please provide a first_name")
    if (!req.body.last_name) throw new Exception("Please provide a last_name")
    if (!req.body.email) throw new Exception("Please provide an email")
    if (!req.body.password) throw new Exception("Please provide a password")

    const userRepo = getRepository(Users)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { email: req.body.email } })
    if (user) throw new Exception("Users already exists with this email")

    const newUser = getRepository(Users).create(req.body);  //Creo un usuario
    const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
    return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).find();
    return res.json(users);
}*/

//LOGIN- DEVUELVE UN TOKEN DE AUTORIZACION AL USUARIO
export const login = async (req: Request, res: Response): Promise<Response> => {

    if (!req.body.email) throw new Exception("Por favor ingrese email en el body", 400);
    if (!req.body.password) throw new Exception("Por favor ingrese password en el body", 400);

    const usuariosRepo = await getRepository(Usuarios);
    const USUARIO = await usuariosRepo.findOne({ where: { email: req.body.email, password: req.body.password } });
    if (!USUARIO) throw new Exception("El email o la contraseña es inválida", 401);

    const token = jwt.sign({ USUARIO }, process.env.JWT_KEY as string);
    return res.json({ USUARIO, token });
}