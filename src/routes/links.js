const express = require('express');
const router = express.Router();

// // AWS
// const AWS = require('aws-sdk');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer')
// const multerS3 = require('multer-s3')

//configuring the AWS environment
// AWS.config.update({
//     accessKeyId: "AKIAJSAE5MIBTH2RLHAA",
//     secretAccessKey: "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"
// });

// var s3 = new AWS.S3();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// let upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'bucket-app-01',
//         key: function (req, file, cb) {
//             console.log(file);
//             // cb(null, file.originalname); //use Date.now() for unique file keys
//             cb(null, "folder/"+Date.now()+"_"+path.basename(file.originalname))
//         }
//     })
// });

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1; //hoy es 0!
    var yyyy = hoy.getFullYear();

    const { nombre, apellidos, numero, correo } = req.body;
    const newLink = {
        nombre,
        apellidos,
        numero,
        correo,
        fecha_nac: yyyy+'-'+mm+'-'+dd,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO contacts set ?', [newLink]);
    req.flash('success', 'Contacto agregado satisfactoriamente');
    res.redirect('/links');
});

// router.post('/add', upload.array('imagen',1), async (req, res, next) => {
//     const { nombre, precio, categoria, descripcion } = req.body; 
//     let key = req.files[0].location
//     console.log(key);
//     const newLink = {
//         nombre,
//         precio,
//         categoria,
//         descripcion,
//         imagen: key,
//         user_id: req.user.id
//     };
//     await pool.query('INSERT INTO links set ?', [newLink]);
//     req.flash('success', 'Producto registrado satisfactoriamente');
//     res.redirect('/links');
//     // res.send("Uploaded!");
// });

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM contacts WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE ID = ?', [id]);
    req.flash('success', 'Contacto borrado satisfactoriamente');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

// router.post('/edit/:id', upload.array('imagen',1), async (req, res) => {
//     const { id } = req.params;
//     const { nombre, precio, categoria, descripcion, imagenUrl, imagen} = req.body; 
//     let key = ''
//     if(req.files.length == 0 ) {
//         key = imagenUrl
//     } else {        
//         key = req.files[0].location
//     } 
//     const newLink = {
//         nombre,
//         precio,
//         categoria,
//         descripcion,
//         imagen: key
//     };
//     await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
//     req.flash('success', 'Producto actualizado satisfactoriamente');
//     res.redirect('/links');
// });

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, numero, correo} = req.body; 
    const newLink = {
        nombre,
        apellidos,
        numero,
        correo,
        // fecha_nac
    };
    await pool.query('UPDATE contacts set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

router.post('/find', isLoggedIn, async (req, res) => {
    let nombre = req.body.nombre
    console.log(nombre);
    const links = await pool.query(`SELECT * FROM contacts WHERE user_id = ? 
                                    AND nombre LIKE '%${nombre}%'`, [req.user.id]);
    res.render('links/list', { links });
})

module.exports = router;