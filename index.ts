const route = require("./src/routers/index");
const express = require("express");
const cors = require("cors");
const app = express();
const port: number = 8080;
const bodyParser = require("body-parser");
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

dotenv.config();
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "https://pizza-restaurant-beta.vercel.app",
            "https://pizza-restaurant-fe.vercel.app",
            "http://localhost:3001",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);
// app.use(express.urlencoded({ extended: true }));
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
