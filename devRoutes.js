const db = require('./db');

module.exports = function(app) {
    app.get('/getUsers', (req, res) => {
        return db
            .getUsers()
            .then(data => res.send(data.rows))
            .catch(e => res.send(e.message));
    });

    app.get('/getSignatures', (req, res) => {
        return db
            .getSignatures()
            .then(data => res.send(data.rows))
            .catch(e => res.send(e.message));
    });

    // PROFILES

    app.get('/getProfiles', (req, res) => {
        return db
            .getProfiles()
            .then(data => res.send(data.rows))
            .catch(e => res.send(e.message));
    });

    app.get('/dropProfiles', (req, res) => {
        return db
            .dropProfiles()
            .then(data => res.send('done'))
            .catch(e => res.send(e.message));
    });

    app.get('/createProfiles', (req, res) => {
        return db
            .createProfiles()
            .then(data => res.send('done'))
            .catch(e => res.send(e.message));
    });

    app.get('/getSignaturesPlus', (req, res) => {
        return db
            .getSignaturesPlus()
            .then(data => res.send(data.rows))
            .catch(e => res.send(e.message));
    });
};
