const express = require('express');
const app = express();
const db = require('./db');
var hb = require('express-handlebars');
app.use(express.static('./public'));
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.get('/wintergreen-Petition', (req, res) => {
    //this is just for demo purposes
    db
        .getAllCities()
        .then(results => {
            //results.rows -- rows is the property that stores rhe results
            //of our query ie it will contain a list of cities
            //results would contain all the cities in our teble
            //but of course this won't work right now
            // because we dont have a cities table
        })
        .catch(err => {
            console.log('err  in getAllCities', err);
        });
});

app.post('/create-new-city', (res, req) => {
    db.addCity('Berlin', 'Berlin').then(() => {});
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
app.post('/wintergreen-petition', (req, res) => {
    res.render;
});
app.listen(8080, () => console.log('Petition liestening!'));
