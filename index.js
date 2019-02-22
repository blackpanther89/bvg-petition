const express = require('express');
const app = express();

const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const bcrypt = require('./bcrypt');

const db = require('./db');
var hb = require('express-handlebars');
var devRoutes = require('./devRoutes');
const helpers = require('./helpers');
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
app.use((req, res, next) => {
    console.log('req.session', req.session);
    next();
});

// protect Petition against CSRF attacks
// app.use(csurf());
//
// app.use(function(req, res, next) {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

devRoutes(app);

// PROFILES

app.get('/wintergreen-petition', (req, res) => {
    res.render('home', {
        message: 'Welcome',
        subheading: 'Welcome to my petition',
        layout: 'main',
    });
});

//render the registration page
app.get('/registration', (req, res) => {
    res.render('registration', {
        layout: 'main',
    });
});

app.post('/registration', (req, res) => {
    // console.log('req.body:', req.body.firstName);
    bcrypt.hashPassword(req.body.password).then(hash => {
        // console.log('hash:', hash);
        db
            .register(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                hash,
            )
            .then(results => {
                // console.log('hello');

                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                req.session.email = req.body.email;
                req.session.userId = results.rows[0].id;
                // console.log(req.session);
                res.redirect('/profile');
            })
            .catch(err =>
                res.render('registration', {
                    layout: 'main',
                    error: 'error',
                }));
    });

    // console.log('error:', error);
});

//Renders the log in page
app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
    });
});

app.post('/login', (req, res) => {
    db.getEmail(req.body.email).then(results => {
        // req.session.userId = results.rows[0].id;
        bcrypt
            .checkPassword(req.body.password, results.rows[0].password)
            .then(match => {
                if (match) {
                    req.session.userId = results.rows[0].id;
                    req.session.firstName = results.rows[0].firstName;
                    req.session.lastName = results.rows[0].lastName;
                    db
                        .getSignature(req.session.userId)
                        .then(results => {
                            if (results.rows.length === 0) {
                                req.session.signed = false;
                            } else {
                                req.session.signed = true;
                            }
                            return res.redirect('/petition');
                        })
                        .catch(e =>
                            res.render('login', {
                                layout: 'main',
                                error: e.message,
                            }));
                } else {
                    res.render('login', {
                        layout: 'main',
                        error: 'Wrong credentials',
                    });
                }
            })
            .catch(e =>
                res.render('login', {
                    layout: 'main',
                    error: e.message,
                }));
    });
});

//render petition page
app.get('/petition', helpers.gotoThanksIfSigned, (req, res) => {
    res.render('petition', {
        layout: 'main',
    });
});

app.post('/petition', (req, res) => {
    // console.log('req.body.signature:', req.body.signature);
    return db
        .createSignature(
            //no longer need to pass the first and last to query
            // req.body.firstName,
            // req.body.lastName,

            req.body.signature,
            req.session.userId,
        )
        .then(results => {
            // req.session.firstName = req.body.firstName;
            // req.session.lastName = req.body.lastName;
            req.session.signatureId = results.rows[0].id;
            // console.log('results.rowsfqfqqfqf:', results.rows);

            res.redirect('/thanks');
        })
        .catch(err => {
            // console.log('err:', err);
            res.render('petition', {
                layout: 'main',
                error: 'error',
            });
        });
});

//render thank you page
app.get('/thanks', (req, res) => {
    return db.getSignature(req.session.userId).then(results => {
        res.render('thanks', {
            layout: 'main',
            signature: results.rows[0].signature,
        });
    });
});

//render signatures page
app.get('/signatures', (req, res) => {
    db
        .getSignaturesPlus()
        .then(results => {
            // console.log('results.rows:', results.rows);
            res.render('signatures', {
                layout: 'main',
                listNames: results.rows,
            });
            // console.log(results.rows);
        })
        .catch(error => {
            // console.log('error:', error);
        });
});

// renders form for data that goes into  new user_profiles table
app.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'main',
    });
});

app.post('/profile', (req, res) => {
    console.log('req.body :', req.body);
    return db
        .userInfo(req.body.age, req.body.city, req.body.url, req.session.userId)
        .then(results => {
            // req.session.userId = results.rows[0].id;
            res.redirect('/petition');
        })
        .catch(e => {
            // console.log(error);
            res.render('profile', {
                layout: 'main',
                error: e.message,
            });
        });
});

app.get('/signatures/:city', (req, res) => {
    return db.getCity(req.params.city).then(results => {
        res.render('signatures', {
            layout: 'main',
            listNames: results.rows,
        });
    });
});
app.get('/update', (req, res) => {
    res.render('update', {
        layout: 'main',
    });
});
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/registration');
});

app.listen(process.env.PORT || 8080, () => console.log('Petition listening!'));
