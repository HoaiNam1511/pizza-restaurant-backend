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
const moment_1 = __importDefault(require("moment"));
const product_1 = __importDefault(require("../model/product"));
const controller_1 = require("../controller/");
const order_1 = require("../model/order");
const get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        const result = yield order_1.Order.findAndCountAll({
            include: [
                {
                    model: order_1.Customer,
                },
                {
                    model: product_1.default,
                    as: 'products',
                },
            ],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        const totalPage = Math.ceil(result.count / limit);
        res.send({
            totalPage: totalPage,
            data: result.rows,
        });
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
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, email, phone, paymentMethod, products, } = req.body;
        //Create string date for code
        let dateNow = new Date();
        // Create new user
        yield order_1.Customer.create({
            name: name,
            address: address,
            email: email.toLowerCase(),
            phone_number: phone,
        });
        //Get new id off customer
        const newIdCustomer = yield (0, controller_1.getNewId)({ TableName: order_1.Customer });
        // Create code
        const code = createCode({ paymentMethod, newIdCustomer });
        yield order_1.Order.create({
            order_code: code,
            customer_id: newIdCustomer,
            order_date: (0, moment_1.default)(dateNow, 'MM-DD-YYYY'),
            order_status: 'pending',
            payment_method: paymentMethod,
            payment_status: 'unpaid',
        });
        const newIdOrder = yield (0, controller_1.getNewId)({ TableName: order_1.Order });
        const orderDetails = products.map((product) => ({
            order_id: newIdOrder,
            product_id: product.productId,
            quantity: product.quantity,
            size: product.size,
        }));
        yield order_1.OrderDetail.bulkCreate(orderDetails);
        res.send({
            message: 'Create order success',
            action: 'add',
        });
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
        res.send({
            message: 'Update order success',
            action: 'update',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.update = update;
