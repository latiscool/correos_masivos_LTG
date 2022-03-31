'use strict';
//Importar el paquete Nodemai,ler a una constante
const nodemailer = require('nodemailer');
//Dotenv es unadependencia  que carga variables de entorno desde un archivo .env a process.env.
require('dotenv').config();

// Crear una función llamada “enviar” que reciba como parámetro los valores de
// “to”, “subject” y “text”
let send = (to, subject, html) => {
  //Guardar en una variable “transporter” el llamado al método createTransport
  // En donde se crea un objeto que contenga el servicio y la autenticación.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PWD,
    },
  });

  // Después de crear el objeto transporter, podemos verificar la configuración
  // de nuestro transportador con verificar (devolución de llamada)
  transporter.verify((error, success) => {
    if (error) {
      console.log(' Ha ocurrida una falla: ' + error);
    } else {
      console.log('El servidor está listo para recibir nuestros mensajes');
    }
  });

  // Crear una variable de tipo Objeto “body_Email” para definir las opciones del correo
  // electrónico de prueba, las cuales serán las siguientes:
  let bodyEmail = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  //  Invoca el método sendMail de la instancia transporter pasándole como
  // argumento las opciones del correo y en su segundo parámetro recibirás un callback,
  // con el error y la data correspondiente al envío

  transporter.sendMail(bodyEmail, (err, data) => {
    if (err) {
      console.log('Ha ocurrido una falla: ' + err);
    }
    console.log(data);
  });
};
// Para recibir los valores desde el cliente en una consulta HTTP,
// importa el módulo url para poder extraer los parámetros de la query strings.
module.exports = send;
