import { Request, Response } from 'express';

export const enviarMail = async (email:string, nombre:string, tipo: string, pass: string ) => {
    var plantilla = '';
    var link = '';
    switch (tipo) {
        case 'Verificar usuario':
            plantilla = 'Verificacion.html';
            link = 'verificacion/'+email;
            break;
    
        case 'Recuperar contraseña':
            plantilla = 'Recuperacion.html';
            link = 'login';
            break;
    
        default:
            break;
    }
    var nodemailer = require("nodemailer");
    var handlebars = require("handlebars");
    var fs = require("fs");

    var readHTMLFile = function (path:any, callback:any) {
        fs.readFile(path, { encoding: "utf-8" }, function (err:any, html:any) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    //Creamos el objeto de transporte
     var transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
             user: process.env.USUARIO,
             pass: process.env.PASS
         }
     });

    readHTMLFile(__dirname + '/views/'+plantilla, function (err:any, html:any) {
        var template = handlebars.compile(html);
        var replacements = {
            username: nombre,
            email: email,
            verificar: process.env.URL + link
        };
        var htmlToSend = template(replacements);
        console.log(htmlToSend);
         var mailOptions = {
         from: process.env.USUARIO,
         to: email,
         subject: 'Verificar Cuenta',
         html: htmlToSend
     };
        transporter.sendMail(mailOptions, function (error:any, response:any) {
            if (error) {
                console.log(error);
            }
        });
    });

}

