const route = require('./src/routers/index');
//import route from './src/routers/index'
const express = require('express');
const cors = require('cors');
const app = express();
const port: number = 8080;
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
const bodyParser = require('body-parser');
import * as dotenv from 'dotenv';

dotenv.config();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.APP_URL,
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

app.use('/images', express.static('images'));
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
