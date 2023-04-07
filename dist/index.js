"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route = require('./src/routers/index');
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const port = 8080;
var bodyParser = require('body-parser');
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use('/images', express.static('images'));
route(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
