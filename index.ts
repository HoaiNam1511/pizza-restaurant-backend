const route = require('./src/routers/index');
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const port: number = 8080;

import { Request, Response } from 'express';

app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    })
);
app.get('/', (req: Request, res: Response) => {
    res.send('GET request to the homepage');
});
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());
app.use('/images', express.static('images'));
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
