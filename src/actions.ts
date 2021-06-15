import { Request, Response } from 'express'
import { getRepository, ObjectLiteral, getConnection } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Usuarios } from './entities/Usuarios'
import { Exception } from './utils'
import jwt from 'jsonwebtoken';
import { enviarMail } from './email/controlador';
import { runInNewContext } from 'vm';
import { Publicaciones } from './entities/Publicaciones';
import { Favoritos } from './entities/Favoritos';
import { Mensajes } from './entities/Mensajes';

const bcrypt = require('bcrypt');

//LOGIN- DEVUELVE UN TOKEN DE AUTORIZACION AL USUARIO
export const login = async (req: Request, res: Response): Promise<Response> => {

    if (!req.body.email) throw new Exception("Por favor ingrese email en el body", 400);
    if (!req.body.password) throw new Exception("Por favor ingrese password en el body", 400);

    const usuariosRepo = await getRepository(Usuarios);
    const USUARIO = await usuariosRepo.findOne({ where: { email: req.body.email } });
    if (!USUARIO) throw new Exception("El email o la contraseña es inválida", 401);
    if (!USUARIO.activo) throw new Exception("EL usuario todavia no esta activo");

    let token = '';
    const validacionPassword = await bcrypt.compare(req.body.password, USUARIO.password)
    validacionPassword ? token = jwt.sign({ USUARIO }, process.env.JWT_KEY as string) : token = 'Invalid password'
    if (token === 'Invalid password') throw new Exception("Contraseña incorrecta");

    return res.json({ message: "Ok", token, usuario: USUARIO });


}
export const crearUsuario = async (req: Request, res: Response): Promise<Response> => {
    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.nombre) throw new Exception("Por favor ingrese su nombre");
    if (!req.body.apellido) throw new Exception("Por favor ingrese su apellido");
    if (!req.body.fechaNacimiento) throw new Exception("Por favor ingrese su fechaNacimiento"); // Preguntar si se valida que es mayor de edad en el front o en el back
    if (!req.body.email) throw new Exception("Por favor ingrese su email");
    if (!req.body.password) throw new Exception("Por favor ingrese su contraseña");
    if (!req.body.tipoUsuario) throw new Exception("Por favor ingrese su tipoUsuario");
    //Valida que el usuario no exista
    const userRepo = getRepository(Usuarios);
    const usuario = await userRepo.findOne({ where: { email: req.body.email } });
    if (usuario) throw new Exception("Este usuario ya existe");

    const USUARIO = new Usuarios();
    USUARIO.nombre = req.body.nombre;
    USUARIO.apellido = req.body.apellido;
    USUARIO.fechaNacimiento = req.body.fechaNacimiento;
    USUARIO.email = req.body.email;
    USUARIO.password = req.body.password;
    USUARIO.tipoUsuario = req.body.tipoUsuario;
    USUARIO.activo = false;

    //Encripta la password y la guarda encriptada
    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(USUARIO.password, salt, async (err: any, hash: any) => {
            if (err) {
                console.log(err);
            }
            //GUARDAR EN BASE DE DATOS
            USUARIO.password = hash;
            const nuevoUsuario = getRepository(Usuarios).create(USUARIO);  //Creo un usuario
            const results = await getRepository(Usuarios).save(nuevoUsuario); //Grabo el nuevo usuario 
            enviarMail(USUARIO.email, USUARIO.nombre, 'Verificar usuario', '', results.id); //Envía email de confirmacion
        })
    })
    return res.json({ message: "Ok", usuario: USUARIO });
}

export const getUSuarios = async (req: Request, res: Response): Promise<Response> => {
    const usuario = await getRepository(Usuarios).find();
    return res.json(usuario);
}

//ACTIVA AL USUARIO
export const updateUsuario = async (req: Request, res: Response): Promise<Response> => {
    const USUARIO = await getRepository(Usuarios).findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("Este usuario no existe");
    USUARIO.activo = true;
    await getRepository(Usuarios).save(USUARIO);
    console.log(USUARIO);
    return res.json({ message: "Ok", usuario: USUARIO });
}

//BORRA USUARIO
export const deleteUsuario = async (req: Request, res: Response): Promise<Response> => {
    const usuarioRepo = getRepository(Usuarios);
    const USUARIO = await usuarioRepo.findOne({ where: { id: req.params.id } });
    if (!USUARIO) throw new Exception("El usuario no existe");

    const result = await usuarioRepo.delete(USUARIO);
    return res.json({ message: "Ok", result: result });
}

//ENVÍA EMAIL CON UNA NUEVA CONTRASEÑA RANDOM
export const recuperarPassword = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email) throw new Exception('Por favor ingrese un email');
    const USUARIO = await getRepository(Usuarios).findOne({ where: { email: req.body.email } });
    if (!USUARIO) throw new Exception("Este usuario no existe");
    let random = Math.random().toString(36).substring(7);
    console.log(random);

    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(random, salt, async (err: any, hash: any) => {
            if (err) {
                console.log(err);
            }
            //GUARDAR EN BASE DE DATOS
            USUARIO.password = hash;
            await getRepository(Usuarios).save(USUARIO);
        })
    })

    enviarMail(USUARIO.email, USUARIO.nombre, 'Recuperar contraseña', random, USUARIO.id);
    return res.json({ message: "Ok", usuario: USUARIO });
}

//MODIFICA DATOS DEL PERFIL USUARIO
export const updatePerfil = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.nombre) throw new Exception("Por favor ingrese su nombre");
    if (!req.body.apellido) throw new Exception("Por favor ingrese su apellido");
    if (!req.body.password) throw new Exception("Por favor ingrese su contraseña");
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const USUARIO = await getRepository(Usuarios).findOne({ where: { id: usuario_id } });
    if (!USUARIO) throw new Exception("Este usuario no existe");
    USUARIO.nombre = req.body.nombre;
    USUARIO.apellido = req.body.apellido;
    if (req.body.password != "") {
        bcrypt.genSalt(10, (err: any, salt: any) => {
            if (err) {
                console.log(err);
            }
            bcrypt.hash(req.body.password, salt, async (err: any, hash: any) => {
                if (err) {
                    console.log(err);
                }
                //GUARDAR EN BASE DE DATOS
                USUARIO.password = hash;
                await getRepository(Usuarios).save(USUARIO);
            })
        })
    }
    return res.json({ message: "Ok", usuario: USUARIO });
}

//CREA UNA PUBLICACION
export const crearPublicacion = async (req: Request, res: Response): Promise<Response> => {
    //Valida campos del body
    if (!req.body.titulo) throw new Exception("Por favor ingrese un título");
    if (!req.body.descripcion) throw new Exception("Por favor ingrese una descripción");
    if (!req.body.url) throw new Exception("Por favor ingrese una imagen");
    if (!req.body.categoria) throw new Exception("Por favor ingrese una categoría");
    if (!req.body.formato) throw new Exception("Por favor ingrese un formato");

    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;

    //Creo una instancia de publicacion con los datos del body
    const PUBLICACION = new Publicaciones();
    PUBLICACION.titulo = req.body.titulo;
    PUBLICACION.descripcion = req.body.descripcion;
    PUBLICACION.url = req.body.url;
    PUBLICACION.categoria = req.body.categoria;
    PUBLICACION.formato = req.body.formato;
    PUBLICACION.usuario = usuario_id; //Relaciono al usuario logueado
    const nuevaPublicacion = getRepository(Publicaciones).create(PUBLICACION);  //Creo la publicacion
    const results = await getRepository(Publicaciones).save(nuevaPublicacion); //Grabo la nueva publicacion
    return res.json({ message: "Ok", publicacion: PUBLICACION });
}

//OBTIENE TODAS LAS PUBLICACIONES DE UN USUARIO
export const getPublicacionesUsuario = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const PUBLICACIONES = await getRepository(Publicaciones)
        .createQueryBuilder("Publicaciones")
        .where("Publicaciones.usuario = :id", { id: usuario_id })
        .orderBy("id", "DESC")
        .getMany();

    console.log(PUBLICACIONES);
    return res.json(PUBLICACIONES);
}

//OBTIENE TODAS LAS PUBLICACIONES DE TODOS LOS USUARIOS
export const getAllPublicaciones = async (req: Request, res: Response): Promise<Response> => {
    if (!req.params.offset) throw new Exception("Por favor ingrese un offset");
    let OFFSET = parseInt(req.params.offset);
    if (OFFSET > 0) {
        OFFSET *= 15;
    }
    console.log(OFFSET);
    const PUBLICACIONES = await getRepository(Publicaciones)
        .createQueryBuilder("Publicaciones")
        .limit(15)
        .offset(OFFSET)
        .orderBy("id", "DESC")
        .getMany();
    return res.json(PUBLICACIONES);
}

//OBTIENE TODAS LAS PUBLICACIONES FILTRADAS POR EL CAMPO
export const getPublicacionesFiltro = async (req: Request, res: Response): Promise<Response> => {
    const PUBLICACIONES = await getRepository(Publicaciones)
        .createQueryBuilder("Publicaciones")
        .where("Publicaciones.categoria = :categoria", { categoria: req.params.categoria })
        .orderBy("id", "DESC")
        .getMany();
    return res.json(PUBLICACIONES);
}

//MODIFICA PUBLICACION DE UN USUARIO
export const updatePublicacion = async (req: Request, res: Response): Promise<Response> => {
    //Valida campos del body
    if (!req.body.titulo) throw new Exception("Por favor ingrese un título");
    if (!req.body.descripcion) throw new Exception("Por favor ingrese una descripción");
    if (!req.body.url) throw new Exception("Por favor ingrese una imagen");
    if (!req.body.formato) throw new Exception("Por favor ingrese un formato");
    if (!req.body.categoria) throw new Exception("Por favor ingrese una categoría");

    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const PUBLICACION = await getRepository(Publicaciones).findOne({ where: { id: req.params.id, usuario: usuario_id } });
    if (!PUBLICACION) throw new Exception("Esta publicación no existe");

    PUBLICACION.titulo = req.body.titulo;
    PUBLICACION.descripcion = req.body.descripcion;
    PUBLICACION.url = req.body.url;
    PUBLICACION.categoria = req.body.categoria;
    PUBLICACION.formato = req.body.formato;
    await getRepository(Publicaciones).save(PUBLICACION);
    return res.json({ message: "Ok", publicacion: PUBLICACION });
}

//BORRA PUBLICACION DE UN USUARIO
export const deletePublicacion = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const publicacionRepo = getRepository(Publicaciones);
    const PUBLICACION = await publicacionRepo.findOne({ where: { id: req.params.id, usuario: usuario_id } });
    if (!PUBLICACION) throw new Exception("La publicación no existe");

    const result = await publicacionRepo.delete(PUBLICACION);
    return res.json({ message: "Ok", result: result });
}

//AGREGAR FAVORITO
export const agregarFavorito = async (req: Request, res: Response): Promise<Response> => {
    //Valida campos del body
    if (!req.body.idPublicacion) throw new Exception("Por favor ingrese una publicación");

    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;

    //Creo una instancia de favorito
    const FAVORITO = new Favoritos();
    FAVORITO.usuario = usuario_id;
    FAVORITO.publicaciones = req.body.idPublicacion;
    const nuevoFavorito = getRepository(Favoritos).create(FAVORITO);  //Creo la publicacion
    const results = await getRepository(Favoritos).save(nuevoFavorito); //Grabo la nueva publicacion
    return res.json({ message: "Ok", favorito: results });
}

//OBTIENE TODOS LOS FAVORITOS DE UN USUARIO
export const getFavoritosUsuario = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const FAVORITOS = await getRepository(Favoritos)
        .createQueryBuilder("Favoritos")
        .leftJoinAndSelect('Favoritos.publicaciones', 'Publicaciones')
        .where("Favoritos.usuario = :id", { id: usuario_id })
        .orderBy("Favoritos.id", "DESC")
        .getMany();

    console.log(FAVORITOS);
    return res.json(FAVORITOS);
}

//BORRA FAVORITO DE UN USUARIO
export const deleteFavorito = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const favoritoRepo = getRepository(Favoritos);
    const FAVORITO = await favoritoRepo.findOne({ where: { id: req.params.id, usuario: usuario_id } });
    if (!FAVORITO) throw new Exception("El favorito no existe");

    const result = await favoritoRepo.delete(FAVORITO);
    return res.json({ message: "Ok", result: result });
}

//ENVIAR MENSAJE
export const enviarMensaje = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const emisor_id = (req.user as ObjectLiteral).USUARIO.id;
    let MENSAJE = new Mensajes();
    MENSAJE.usuarioEmisor = emisor_id.toString();
    MENSAJE.usuarioReceptor = req.body.receptor;
    MENSAJE.asunto = req.body.asunto;
    MENSAJE.mensaje = req.body.mensaje;
    console.log(MENSAJE);

    const nuevoMensaje = getRepository(Mensajes).create(MENSAJE);  //Creo mensaje
    const results = await getRepository(Mensajes).save(nuevoMensaje); //Grabo mensaje
    return res.json({ message: "Ok", mensaje: results });
}

//TRAER CONVERSACION
//OBTIENE TODOS LOS FAVORITOS DE UN USUARIO
export const getConversacion = async (req: Request, res: Response): Promise<Response> => {
    //Obtengo id del usuario desde el token
    const usuario_id = (req.user as ObjectLiteral).USUARIO.id;
    const MENSAJES = await getRepository(Mensajes)
        .createQueryBuilder("Mensajes")
        .where("Mensajes.usuarioEmisor = :id", { id: usuario_id })
        .orWhere("Mensajes.usuarioReceptor = :id", { id: usuario_id })
        .andWhere("Mensajes.usuarioEmisor = :id", { id: req.params.receptor })
        .orWhere("Mensajes.usuarioReceptor = :id", { id: req.params.receptor })
        .orderBy("Mensajes.id", "DESC")
        .getMany();

    return res.json(MENSAJES);
}

