const express = require('express');
const app = express();
const db = require('./db');
var hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
app.use(express.static('./public'));
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    }),
);
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(csurf());
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.get('/wintergreen-petition', (req, res) => {
    res.render('home', {
        message: 'Welcome',
        subheading: 'Welcome to my petition',
        layout: 'main',
    });
});

app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main',
    });
});

// app.get('/signatures', (req, res) => {
//     res.render('signatures', {
//         layout: 'main',
//     });
// });

app.get('/signatures', (req, res) => {
    db.listSignatures().then(results => {
        res.render({list: results});
    });
});

app.get('/thanks', (req, res) => {
    res.render('thanks', {
        layout: 'main',
    });
});

app.post('/petition', (req, res) => {
    return db
        .getDetails(req.body.firstName, req.body.lastName, req.body.signature)
        .then(data => {
            req.session.id = data.rows[0].id;
            res.redirect('/thanks');
        });
    // .then(results => {
    //     if (results) req.render('petition', {message: 'done'});
    //     else res.render('petition', {error: 'Please register '});
    // })
    // .catch(err => console.log(err));
});

app.listen(8080, () => console.log('Petition liestening!'));
