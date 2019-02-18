const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const bcrypt = require('./bcrypt');

const db = require('./db');
var hb = require('express-handlebars');

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

//render petition page
app.get('/petition', (req, res) => {
    res.render('petition', {
        layout: 'main',
    });
});

//render signatures page
app.get('/signatures', (req, res) => {
    db
        .listSignatures()
        .then(results => {
            res.render('signatures', {
                layout: 'main',
                listNames: results.rows,
            });
            console.log(results.rows);
        })
        .catch(err => {
            console.log('error:', error);
        });
});

//render thank you page
app.get('/thanks', (req, res) => {
    return db.userSignature().then(results => {
        res.render('thanks', {
            layout: 'main',
            img: results.rows[0],
        });
    });
});

app.get('/registration', (req, res) => {
    res.render('registration', {
        layout: 'main',
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
    });
});

app.get('profile', (req, res) => {
    res.render('profile', {
        layout: 'main',
    });
});

app.post('/petition', (req, res) => {
    return db
        .getDetails(req.body.firstName, req.body.lastName, req.body.signature)
        .then(data => {
            // req.session.firstName = req.body.firstName;
            // req.session.lastName = req.body.lastName;
            // req.session.signature = results.rows[0].id;
            // console.log(req.session);

            res.redirect('/thanks');
        })
        .catch(err =>
            res.render('petition', {
                layout: 'main',
                error: 'error',
            }));
    console.log(err);
});

app.post('/registration', (req, res) => {
    //     return bcrypt.hash(req.body.password).then(hashPassword=>
    //     db
    //         .register(
    //             req.body.firstName,
    //             req.body.lastName,
    //             req.body.email,
    //
    //         )
    //         .then(results => {
    //             req.session.firstName = req.body.firstname;
    //             req.session.lastName = req.body.lastname;
    //             req.session.email = req.body.email;
    //             req.session.userID = results.rows[0].id;
    //             console.log(req.session);
    //
    //             res.redirect('/petition');
    //         })
    //         .catch(err =>
    //             res.render('registration', {
    //                 layout: 'main',
    //                 error: 'error',
    //             }))
    //     console.log( 'error:', error);
    // })
    //  {
    return db
        .register(req.body.firstName, req.body.lastName, req.body.email)
        .then(data => {
            console.log(req.session);
            res.redirect('/profile');
        })
        .catch(err =>
            res.render('registration', {
                layout: 'main',
                error: 'error',
            }));
    console.log(err);
});
app.post('/login', (req, res) => {
    return db
        .login(req.session.id)
        .then(data => {
            console.log(req.session);
            res.redirect('/petiton');
        })
        .catch(err =>
            res.render('registration', {
                layout: 'main',
                error: 'error',
            }));
    console.log(err);
});
app.listen(8080, () => console.log('Petition liestening!'));
