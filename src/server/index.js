'use strict';

const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const articlesRoutes = require('./routes/articlesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const initDataCache = require('./services/cache').initDataCache;

function startServer(port) {
    console.log('Starting web server...');
    let server = http.createServer(app);
    server.listen(port, () => {
        console.log(`Exchange Application API Server is ready on http://localhost:${server.address().port}! Waiting for requests...`);
    });
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './../../public')));
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);

let useDataCache = false;
let resetData = false;

if (useDataCache) {
    initDataCache(resetData)
        .then(() => {
            console.log('Data Cache initialised');
            startServer(3001);
        })
        .catch((err) => {
            console.log('Error initialising cache: ' + err);
        });
} else {
    startServer(3001);
}
