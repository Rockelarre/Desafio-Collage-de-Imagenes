//  Importar dependencias
const express = require('express');
const app = express();
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs');

// Iniciar servidor
app.listen(3000);

// Integración de body-parser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// Integración de express-fileupload a través de middleware
app.use( expressFileUpload({
    limits: { fileSize: 5000000},
    abortOnLimit: true,
    responseOnLimit:'El peso del archivo que intentas subir supera el limite permitido',
}))

// Publicar carpeta archivos
app.use(express.static('archivos'));

// Ruta raíz con el formulario
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/formulario.html')
})

// Ruta GET /collage que expone la galería de imágenes
app.get('/collage',(req,res) => {
    res.sendFile(__dirname + '/collage.html')
})

// Ruta POST para cargar las imágenes
app.post('/collage',(req,res) => {
    const { target_file } = req.files;
    const { posicion } = req.body;
    target_file.mv(`${__dirname}/archivos/imagen-${posicion}.jpg`, (err) =>{
        res.sendFile(__dirname + '/collage.html')
    })
})

// Ruta GET para eliminar las imágenes
app.get('/deleteImg/:nombre', (req,res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/archivos/${nombre}`,(err) => {
        res.redirect('/collage')
    })
})