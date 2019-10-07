const express = require('express');
const router = express.Router();

// AWS
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

//configuring the AWS environment
AWS.config.update({
    accessKeyId: "AKIAJSAE5MIBTH2RLHAA",
    secretAccessKey: "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"
});

var s3 = new AWS.S3();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {

    const { nombre, precio, categoria, descripcion, imagen } = req.body; 

    // let image;
    // req.pipe(req.busboy);
    // req.busboy.on('file', function (fieldname, file, filename) {
    //     // console.log("Uploading: " + file); 
    //     console.log(Object.keys(file));
    //     console.log(Object.values(file));
    //     image = fs.createWriteStream(__dirname + '/files/' + filename);
    //     file.pipe(image);
    //     image.on('close', function () {
    //         res.redirect('back');
    //     });
    // });

    console.log(nombre);
    console.log(precio);
    console.log(categoria);
    console.log(descripcion);
    console.log(imagen);

    //configuring parameters
    var params = {
        Bucket: 'bucket-app-01',
        Body : fs.createReadStream(imagen),
        Key : "folder/"+Date.now()+"_"+path.basename(imagen)
    };

    data1 = s3.upload(params, function (err, data) {
        //handle error
        if (err) {
          console.log("Error", err);
        }      
        //success
        if (data) {
          console.log("Uploaded in:", data.Location);
        }
    }); 

    // console.log('DATTAAAAAAAAAAAAAA')
    // console.log('----------------------');
    let key = data1.service.config.params.Key

    let params2 = {
        Bucket: 'bucket-app-01'
    };

    data = s3.listObjects(params2, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success");
            console.log("------------------------------");
            // console.log(data.CommonPrefixes);
            // console.log(data.Contents[0]);
            // console.log(data);
            return data
        }
    });
    
    const newLink = {
        nombre,
        precio,
        categoria,
        descripcion,
        imagen: `https://bucket-app-01.s3.us-east-2.amazonaws.com/${key}`,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Producto registrado satisfactoriamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Producto eliminado satisfactoriamente');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria, descripcion} = req.body; 
    const newLink = {
        nombre,
        precio,
        categoria,
        descripcion,
        // imagen
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Producto actualizado satisfactoriamente');
    res.redirect('/links');
});

module.exports = router;