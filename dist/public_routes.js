"use strict";
exports.__esModule = true;
/**
 * Public Routes are those API url's that anyone can request
 * whout having to be logged in, for example:
 *
 * POST /user is the endpoint to create a new user or "sign up".
 * POST /token can be the endpoint to "log in" (generate a token)
 */
var express_1 = require("express");
// import { createUser } from './actions';
var router = express_1.Router();
// signup route, creates a new user in the DB
// router.post('/user', safe(createUser));
exports["default"] = router;
