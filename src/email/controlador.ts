import { Request, Response } from 'express';

export const enviarMail = async (email:string, nombre:string ) => {
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
             user: 'fproyecto07@gmail.com',
             pass: 'proyectofinal-07'
         }
     });

    readHTMLFile(__dirname + '/views/plantilla.html', function (err:any, html:any) {
        var template = handlebars.compile(html);
        var replacements = {
            username: nombre,
            email: email,
            verificar: "https://3001-emerald-meerkat-qz05aizk.ws-us08.gitpod.io/verificar/"+email
        };
        var htmlToSend = template(replacements);
        console.log(htmlToSend);
         var mailOptions = {
         from: 'fproyecto07@gmail.com',
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

