const route = require('./src/routers/index');
//import route from './src/routers/index'
const express = require('express');
const cors = require('cors');
const app = express();
const port: number = 8080;
import { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
const bodyParser = require('body-parser');
import * as dotenv from 'dotenv';

dotenv.config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(function (req: Request, res: Response, next: NextFunction) {
    // Website you wish to allow to connect
    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://pizza-restaurant-fe.vercel.app'
    );
    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://pizza-restaurant-beta.vercel.app'
    );

    // Request methods you wish to allow
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );

    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );

    // Pass to next layer of middleware
    next();
});
app.use(
    cors({
        origin: [
            'https://pizza-restaurant-fe.vercel.app',
            'https://pizza-restaurant-beta.vercel.app',
        ],
        credentials: true,
    })
);

app.get('/', (req: Request, res: Response) => {
    res.send('GET request to the homepage');
});

// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
