"use strict";
// const { Sequelize } = require('sequelize');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// const db = new Sequelize(
//     'bo6vjvicpubskimc89zc',
//     'uhtwmprqicd1l7hw',
//     'oQkJuaD2Fs9FpC3tIabj',
//     {
//         host: 'bo6vjvicpubskimc89zc-mysql.services.clever-cloud.com',
//         dialect: 'mysql',
//         timezone: '+07:00',
//         define: {
//             timestamps: false,
//         },
//         logging: false,
//     }
// );
// let connectDB = async () => {
//     try {
//         await db.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };
// connectDB();
// export { db };
const { Sequelize } = require('sequelize');
const db = new Sequelize('pizza_restaurant', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00',
    define: {
        timestamps: false,
    },
    logging: false,
});
exports.db = db;
let connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
connectDB();
