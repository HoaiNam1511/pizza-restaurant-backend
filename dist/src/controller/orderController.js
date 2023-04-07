"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.get = void 0;
const order_1 = require("../model/order");
const product_1 = __importDefault(require("../model/product"));
const moment = require('moment');
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield order_1.Order.findAll({
            include: [
                {
                    model: order_1.Customer,
                },
                {
                    model: product_1.default,
                    as: 'products',
                },
            ],
        });
        res.send(response);
    }
    catch (err) {
        console.log(err);
    }
});
exports.get = get;
const createCode = ({ paymentMethod, newIdCustomer }) => {
    const dateNow = new Date();
    let code = `${paymentMethod.slice(0, 3)}${dateNow.getSeconds()}${dateNow.getDate()}${dateNow.getMonth() + 1}${dateNow.getFullYear()}`;
    code += `ifc${newIdCustomer}`;
    return code;
};
const getNewId = ({ TableName }) => __awaiter(void 0, void 0, void 0, function* () {
    const newId = yield TableName.findOne({
        attributes: ['id'],
        order: [['id', 'DESC']],
    });
    return newId.id;
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerName, address, email, phoneNumber, paymentMethod, productId, } = req.body;
        //Create string date for code
        let dateNow = new Date();
        // Create new user
        yield order_1.Customer.create({
            name: customerName,
            address: address,
            email: email,
            phone_number: phoneNumber,
        });
        //Get new id off customer
        const newIdCustomer = yield getNewId({ TableName: order_1.Customer });
        // Create code
        const code = createCode({ paymentMethod, newIdCustomer });
        yield order_1.Order.create({
            order_code: code,
            customer_id: newIdCustomer,
            order_date: moment(dateNow, 'MM-DD-YYYY'),
            order_status: 'pending',
            payment_method: paymentMethod,
            payment_status: 'unpaid',
        });
        const newIdOrder = yield getNewId({ TableName: order_1.Order });
        const orderDetails = productId.map((id) => ({
            order_id: newIdOrder,
            product_id: id,
        }));
        yield order_1.OrderDetail.bulkCreate(orderDetails);
        res.send('Created order');
    }
    catch (err) {
        console.log(err);
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus, paymentMethod } = req.body;
        if (orderStatus === 'shipped' && paymentMethod === 'crash') {
            yield order_1.Order.update({
                order_status: orderStatus,
                payment_status: 'paid',
            }, {
                where: {
                    id: id,
                },
            });
        }
        else if (orderStatus !== 'shipped' && paymentMethod === 'crash') {
            yield order_1.Order.update({
                order_status: orderStatus,
            }, {
                where: {
                    id: id,
                },
            });
        }
        else {
            yield order_1.Order.update({
                order_status: orderStatus,
                payment_status: paymentStatus,
            }, {
                where: {
                    id: id,
                },
            });
        }
        res.send('success');
    }
    catch (err) {
        console.log(err);
    }
});
exports.update = update;
