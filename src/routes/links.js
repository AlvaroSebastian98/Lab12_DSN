const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

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