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

// protect Petition against CSRF attacks
app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// ==== DEVELOPER ROUTES === //

app.get('/getSignatures', (req, res) => {
    return db.getSignatures().then(({rows}) => {
        res.send(rows);
    });
});
// ==== DEVELOPER ROUTES === //

//====ROUTES====//

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

app.post('/petition', (req, res) => {
    console.log(req.body);
    return db
        .createSignature(
            req.body.firstName,
            req.body.lastName,
            req.body.signature,
        )
        .then(({rows}) => {
            req.session.firstName = req.body.firstName;
            req.session.lastName = req.body.lastName;
            req.session.signatureId = rows[0].id;
            console.log(req.session);

            res.redirect('/thanks');
        })
        .catch(err =>
            res.render('petition', {
                layout: 'main',
                error: 'error',
            }));
    console.log(err.message);
});

//render thank you page
app.get('/thanks', (req, res) => {
    return db.getSignature(req.session.signatureId).then(results => {
        console.log(results);
        res.render('thanks', {
            layout: 'main',
            signature: results.rows[0].signature,
        });
    });
});

//render signatures page
app.get('/signatures', (req, res) => {
    db
        .getSignatures()
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

//render the registration page
app.get('/registration', (req, res) => {
    res.render('registration', {
        layout: 'main',
    });
});

app.post('/registration', (req, res) => {
    console.log(req.body);
    bcrypt.hashPassword(req.body.password);
    return db
        .register(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            password,
        )
        .then(({rows}) => {
            req.session.firstName = req.body.firstName;
            req.session.lastName = req.body.lastName;
            req.session.email = req.body.email;
            req.session.userId = results.rows[0].id;
            console.log(req.session);

            res.redirect('/petiton');
        })
        .catch(err =>
            res.render('registration', {
                layout: 'main',
                error: 'error',
            }));
    // console.log('error:', error);
});

//Renders the log in page
app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
    });
});

app.post('/login', (req, res) => {
    db
        .getEmail(req.body.email)
        .then(data => {
            return bcrypt.compare(req.body.password, results.rows[0].password);
            res.redirect('/petiton');
        })
        .catch(err =>
            res.render('registration', {
                layout: 'main',
                error: 'error',
            }));
    console.log(err);
});

app.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'main',
    });
});

// app.post('/registration', (req, res) => {
//     //     return bcrypt.hash(req.body.password).then(hashPassword=>
//     //     db
//     //         .register(
//     //             req.body.firstName,
//     //             req.body.lastName,
//     //             req.body.email,
//     //
//     //         )
//     //         .then(results => {
//     //             req.session.firstName = req.body.firstname;
//     //             req.session.lastName = req.body.lastname;
//     //             req.session.email = req.body.email;
//     //             req.session.userID = results.rows[0].id;
//     //             console.log(req.session);
//     //
//     //             res.redirect('/petition');
//     //         })
//     //         .catch(err =>
//     //             res.render('registration', {
//     //                 layout: 'main',
//     //                 error: 'error',
//     //             }))
//     //     console.log( 'error:', error);
//     // })
//     //  {
//     return db
//         .register(req.body.firstName, req.body.lastName, req.body.email)
//         .then(data => {
//             console.log(req.session);
//             res.redirect('/profile');
//         })
//         .catch(err =>
//             res.render('registration', {
//                 layout: 'main',
//                 error: 'error',
//             }));
//     console.log(err);
// });
// app.post('/login', (req, res) => {
//     return db
//         .login(req.session.id)
//         .then(data => {
//             console.log(req.session);
//             res.redirect('/petiton');
//         })
//         .catch(err =>
//             res.render('registration', {
//                 layout: 'main',
//                 error: 'error',
//             }));
//     console.log(err);
// });
app.listen(8080, () => console.log('Petition liestening!'));
