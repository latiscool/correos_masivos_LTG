// Importar la función enviar del archivo mailer.js
const send = require('./mailer.js');
const url = require('url');
const http = require('http');
const fs = require('fs');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
// const axios = require('axios');

const requestListener = (req, res) => {
  // Guardar en variables los parámetros “para”, “asunto” y “contenido”
  let { correos, asunto, contenido } = url.parse(req.url, true).query;
  if (req.url == '/') {
    //     Especificar en la ruta raíz que se devolverá contenido HTML con la cabecera
    // correspondiente
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('index.html', 'utf-8', (err, html) => {
      if (err) {
        console.log('Ha ocurrido una falla: ' + err);
      }
      // Devolver el contenido del archivo index.html en la ruta raíz.
      res.end(html);
    });
  }

  // Crear la ruta “ mailing”, la cual será la encargada de ejecutar la función "send" importada del archivo mailer.js
  if (req.url.startsWith('/mailing')) {
    //   correos electrónicos masivos separados por comas,
    // devuelve un mensaje de error al cliente en caso de intentar mandar un string
    // en el campo “Para” que no incluya la coma...Ademas de validar si hay campos vacios

    correos !== '' && asunto !== '' && contenido !== '' && correos.includes(',')
      ? send(correos.split(','), asunto, contenido)
      : res.end(
          'Debes completar todos los campos y/o enviar a mas de 1 destinatario de correo'
        );

    let idEmail = uuidv4().slice(0, 6);
    //Guardar en la carpeta correos los correos con un id y los correos
    fs.writeFile(
      `./correos/id_${idEmail}_-_${correos}_-_.txt`,
      correos,
      'utf-8',
      (err, data) => {
        if (err) {
          res.end(`<h2>Ups..!Lo sentimos ha ocurrido un erro : ${err}</h2>`);
        } else {
          res.end(`<h2>"Se han enviado con exitos los correos.!</h2>`);
          console.log('Se han enviado con exitos los correos');
        }
      }
    );
  }
};

//Armando el Server
const server = http.createServer(requestListener);

//Levantando el Server
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log('Servidor se esta ejecutando');
});
