"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.updateUsuario = exports.getUSuarios = exports.crearUsuario = exports.login = void 0;
var typeorm_1 = require("typeorm"); // getRepository"  traer una tabla de la base de datos asociada al objeto
var Usuarios_1 = require("./entities/Usuarios");
var utils_1 = require("./utils");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var controlador_1 = require("./email/controlador");
//LOGIN- DEVUELVE UN TOKEN DE AUTORIZACION AL USUARIO
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usuariosRepo, USUARIO, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email)
                    throw new utils_1.Exception("Por favor ingrese email en el body", 400);
                if (!req.body.password)
                    throw new utils_1.Exception("Por favor ingrese password en el body", 400);
                return [4 /*yield*/, typeorm_1.getRepository(Usuarios_1.Usuarios)];
            case 1:
                usuariosRepo = _a.sent();
                return [4 /*yield*/, usuariosRepo.findOne({ where: { email: req.body.email, password: req.body.password } })];
            case 2:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("El email o la contraseña es inválida", 401);
                token = jsonwebtoken_1["default"].sign({ USUARIO: USUARIO }, process.env.JWT_KEY);
                return [2 /*return*/, res.json({ USUARIO: USUARIO, token: token })];
        }
    });
}); };
exports.login = login;
var crearUsuario = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userRepo, usuario, USUARIO, nuevoUsuario, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // important validations to avoid ambiguos errors, the client needs to understand what went wrong
                if (!req.body.nombre)
                    throw new utils_1.Exception("Por favor ingrese su nombre");
                if (!req.body.apellido)
                    throw new utils_1.Exception("Por favor ingrese su apellido");
                if (!req.body.fechaNacimiento)
                    throw new utils_1.Exception("Por favor ingrese su fechaNacimiento"); // Preguntar si se valida que es mayor de edad en el front o en el back
                if (!req.body.email)
                    throw new utils_1.Exception("Por favor ingrese su email");
                if (!req.body.password)
                    throw new utils_1.Exception("Por favor ingrese su contraseña");
                if (!req.body.tipoUsuario)
                    throw new utils_1.Exception("Por favor ingrese su tipoUsuario");
                userRepo = typeorm_1.getRepository(Usuarios_1.Usuarios);
                return [4 /*yield*/, userRepo.findOne({ where: { email: req.body.email } })];
            case 1:
                usuario = _a.sent();
                if (usuario)
                    throw new utils_1.Exception("Este usuario ya existe");
                USUARIO = new Usuarios_1.Usuarios();
                USUARIO.nombre = req.body.nombre;
                USUARIO.apellido = req.body.apellido;
                USUARIO.fechaNacimiento = req.body.fechaNacimiento;
                USUARIO.email = req.body.email;
                USUARIO.password = req.body.password;
                USUARIO.tipoUsuario = req.body.tipoUsuario;
                USUARIO.activo = false;
                nuevoUsuario = typeorm_1.getRepository(Usuarios_1.Usuarios).create(USUARIO);
                return [4 /*yield*/, typeorm_1.getRepository(Usuarios_1.Usuarios).save(nuevoUsuario)];
            case 2:
                results = _a.sent();
                controlador_1.enviarMail(USUARIO.email, USUARIO.nombre); //Envía email de confirmacion
                return [2 /*return*/, res.json(results)];
        }
    });
}); };
exports.crearUsuario = crearUsuario;
var getUSuarios = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usuario;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Usuarios_1.Usuarios).find()];
            case 1:
                usuario = _a.sent();
                return [2 /*return*/, res.json(usuario)];
        }
    });
}); };
exports.getUSuarios = getUSuarios;
var updateUsuario = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var USUARIO;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, typeorm_1.getRepository(Usuarios_1.Usuarios).findOne({ where: { email: req.params.email } })];
            case 1:
                USUARIO = _a.sent();
                if (!USUARIO)
                    throw new utils_1.Exception("Este usuario no existe");
                USUARIO.activo = true;
                return [4 /*yield*/, typeorm_1.getRepository(Usuarios_1.Usuarios).save(USUARIO)];
            case 2:
                _a.sent();
                console.log(USUARIO);
                return [2 /*return*/, res.json(USUARIO)];
        }
    });
}); };
exports.updateUsuario = updateUsuario;
