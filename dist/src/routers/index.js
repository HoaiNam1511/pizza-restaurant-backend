"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = __importDefault(require("./products"));
const category_1 = __importDefault(require("./category"));
const order_1 = __importDefault(require("./order"));
const booking_1 = __importDefault(require("./booking"));
const table_1 = __importDefault(require("./table"));
const account_1 = __importDefault(require("./account"));
const auth_1 = __importDefault(require("./auth"));
function route(app) {
    app.use('/product', products_1.default);
    app.use('/category', category_1.default);
    app.use('/order', order_1.default);
    app.use('/booking', booking_1.default);
    app.use('/table', table_1.default);
    app.use('/account', account_1.default);
    app.use('/auth', auth_1.default);
}
module.exports = route;
