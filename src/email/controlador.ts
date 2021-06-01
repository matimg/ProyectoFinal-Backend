import { Request, Response } from 'express';

export const enviarMail = async (req: Request, res: Response): Promise<Response> => {
    //Requerimos el paquete
    var nodemailer = require('nodemailer');

    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fproyecto07@gmail.com',
            pass: 'proyectofinal-07'
        }
    });

    var mensaje = "Hola desde nodejs...";

    let fs = require('fs');
    const path = require('path');
    const coolPath = path.join(__dirname, 'plantilla.html');
    var htmlstream = fs.createReadStream(coolPath);

    var mailOptions = {
        from: 'fproyecto07@gmail.com',
        to: 'fproyecto07@gmail.com',
        subject: 'Pruena node',
        //text: mensaje,
        html: htmlstream
    };

    transporter.sendMail(mailOptions, function (error:any, info:any) {
        if (error) {
            return res.json("error");
        } else {
            res.json('Email enviado: ' + info.response);
        }
    });
    return res.json("Ok");
}

