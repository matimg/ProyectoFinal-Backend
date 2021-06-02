import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Usuarios } from './entities/Usuarios'
import { Exception } from './utils'
import jwt from 'jsonwebtoken';
import { enviarMail } from './email/controlador';

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
export const crearUsuario = async (req: Request, res:Response): Promise<Response> =>{
    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.nombre) throw new Exception("Por favor ingrese su nombre")
	if(!req.body.apellido) throw new Exception("Por favor ingrese su apellido")
	if(!req.body.fechaNacimiento) throw new Exception("Por favor ingrese su fechaNacimiento") // Preguntar si se valida que es mayor de edad en el front o en el back
    if(!req.body.email) throw new Exception("Por favor ingrese su email")
	if(!req.body.password) throw new Exception("Por favor ingrese su contraseña")
    if(!req.body.tipoUsuario) throw new Exception("Por favor ingrese su tipoUsuario")

    //Valida que el usuario no exista
	const userRepo = getRepository(Usuarios)
	const usuario = await userRepo.findOne({ where: {email: req.body.email }})
	if(usuario) throw new Exception("Este usuario ya existe");

    const USUARIO = new Usuarios();
    USUARIO.nombre = req.body.nombre;
    USUARIO.apellido = req.body.apellido;
    USUARIO.fechaNacimiento = req.body.fechaNacimiento;
    USUARIO.email = req.body.email;
    USUARIO.password = req.body.password;
    USUARIO.tipoUsuario = req.body.tipoUsuario;
    USUARIO.activo = false;

	const nuevoUsuario = getRepository(Usuarios).create(USUARIO);  //Creo un usuario
    const results = await getRepository(Usuarios).save(nuevoUsuario); //Grabo el nuevo usuario 
    enviarMail(USUARIO.email, USUARIO.nombre); //Envía email de confirmacion
	return res.json(results);
}

export const getUSuarios = async (req: Request, res: Response): Promise<Response> =>{
    const usuario = await getRepository(Usuarios).find();
    return res.json(usuario);
}

export const updateUsuario = async (req: Request, res: Response): Promise<Response> =>{
    const USUARIO = await getRepository(Usuarios).findOne({where:{email: req.params.email}});
    if(!USUARIO) throw new Exception("Este usuario no existe");
    USUARIO.activo = true;
    await getRepository(Usuarios).save(USUARIO);
    console.log(USUARIO);
    return res.json(USUARIO);
}