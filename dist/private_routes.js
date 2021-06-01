"use strict";
/**
 * Pivate Routes are those API urls that require the user to be
 * logged in before they can be called from the front end.
 *
 * Basically all HTTP requests to these endpoints must have an
 * Authorization header with the value "Bearer <token>"
 * being "<token>" a JWT token generated for the user using
 * the POST /token endpoint
 *
 * Please include in this file all your private URL endpoints.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// declare a new router to include all the endpoints
var router = express_1.Router();
//middleware de verificación
var verifyToken = function (req, res, next) {
    //headers con el token
    var token = req.header('Authorization');
    if (!token)
        return res.status(400).json({ 'message': 'ACCESS DENIED' });
    var decoded = jsonwebtoken_1["default"].verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
};
// router.get('/user', safe(actions.getUsers));
exports["default"] = router;
