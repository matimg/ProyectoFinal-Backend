"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var utils_1 = require("./utils");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var actions = __importStar(require("./actions"));
// declare a new router to include all the endpoints
var router = express_1.Router();
//middleware de verificación
var verifyToken = function (req, res, next) {
    //headers con el token
    var token = req.header('Authorization');
    if (!token)
        return res.status(400).json({ 'message': 'ACCESO DENEGADO' });
    var decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
};
//MODIFICA PERFIL DE UN USUARIO
router.put('/usuarios/', verifyToken, utils_1.safe(actions.updatePerfil));
//LISTA PUBLICACIONES DE UN USUARIO
router.get('/usuarios/publicaciones', verifyToken, utils_1.safe(actions.getPublicacionesUsuario));
//LISTA PUBLICACIONES DE TODOS LOS USUARIO
router.get('/allPublicaciones/:offset', verifyToken, utils_1.safe(actions.getAllPublicaciones));
//PUBLICAR
router.post('/usuarios/publicaciones', verifyToken, utils_1.safe(actions.crearPublicacion));
//MODIFICA UNA PUBLICACION DE UN USUARIO
router.put('/usuarios/publicaciones/:id', verifyToken, utils_1.safe(actions.updatePublicacion));
//ELIMINA UNA PUBLICACION DE UN USUARIO
router["delete"]('/usuarios/publicaciones/:id', verifyToken, utils_1.safe(actions.deletePublicacion));
//AGREGAR FAVORITO
router.post('/favorito', verifyToken, utils_1.safe(actions.agregarFavorito));
//LISTA FAVORITOS DE UN USUARIO
router.get('/favoritos', verifyToken, utils_1.safe(actions.getFavoritosUsuario));
//ELIMINA UNA PUBLICACION DE UN USUARIO
router["delete"]('/favorito/:id', verifyToken, utils_1.safe(actions.deleteFavorito));
//ENVIA MENSAJE
router.post('/mensaje', verifyToken, utils_1.safe(actions.enviarMensaje));
//LISTA CONVERSACION DE UNA PERSONA A OTRA PERSONA
router.get('/mensajes/:receptor', verifyToken, utils_1.safe(actions.getConversacion));
//LISTA CONVERSACION DE UNA PERSONA A OTRA PERSONA
router.get('/publicaciones/:categoria', verifyToken, utils_1.safe(actions.getPublicacionesFiltro));
//LISTA DETALLE DE UNA PUBLICACION
router.get('/publicacion/detalle/:idPublicacion', verifyToken, utils_1.safe(actions.getPublicacionDetalle));
exports["default"] = router;
