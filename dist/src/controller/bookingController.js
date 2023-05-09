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
exports.verifyBooking = exports.getAll = exports.updateBooking = exports.create = exports.updateStatusTable = exports.getNewTable = void 0;
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Op } = require('sequelize');
const table_1 = __importDefault(require("../model/table"));
const booking_1 = __importDefault(require("../model/booking"));
const mail_1 = require("../util/mail");
const formEmailBooking_1 = require("../custom/formEmailBooking");
const getNewTable = (tableSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTableId;
        //If table is null will get new table
        newTableId = yield table_1.default.findOne({
            attributes: ['id'],
            where: {
                table_used: false,
                table_size: { [Op.gte]: tableSize },
            },
        });
        (0, exports.updateStatusTable)(newTableId.id);
        return newTableId.id;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getNewTable = getNewTable;
const updateStatusTable = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get table update status
        const currentTable = yield table_1.default.findOne({
            attributes: ['table_used'],
            where: {
                id: tableId,
            },
        });
        //Update status
        yield table_1.default.update({
            table_used: !currentTable.table_used,
        }, {
            where: {
                id: tableId,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateStatusTable = updateStatusTable;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTableId;
        const { customerName, email, phone, time, date, partySize, bookingStatus = 'pending', note = '', tableId = null, } = req.body;
        if (!tableId) {
            newTableId = yield (0, exports.getNewTable)(partySize);
            if (newTableId) {
                (0, exports.updateStatusTable)(newTableId);
            }
        }
        else {
            (0, exports.updateStatusTable)(tableId);
        }
        //const booking = new Booking();
        yield booking_1.default.create({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            booking_date: (0, moment_1.default)(date),
            booking_time: time,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId ? tableId : newTableId,
            note: note,
        });
        bcrypt_1.default
            .hash(email, parseInt(process.env.BCRYPT_SALT))
            .then((hashEmail) => {
            const link = `${process.env.APP_URL}/booking/verify?email=${email}&token=${hashEmail}`;
            (0, mail_1.sendMail)(email, 'Pizza Restaurant booking', (0, formEmailBooking_1.formEmail)({
                customerName,
                date,
                time,
                partySize,
                href: link,
            }));
        });
        res.send('created');
    }
    catch (err) {
        console.log(err);
    }
});
exports.create = create;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { customerName, email, phone, time, date, partySize, bookingStatus, note, tableId, } = req.body;
        if (bookingStatus === 'done' || bookingStatus === 'cancel') {
            if (tableId) {
                (0, exports.updateStatusTable)(tableId);
            }
        }
        yield booking_1.default.update({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            booking_date: (0, moment_1.default)(date),
            booking_time: time,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId,
            note: note,
        }, {
            where: {
                id: id,
            },
        });
        res.send('updated');
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateBooking = updateBooking;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, } = req.query;
        const offSet = (page - 1) * limit;
        const response = yield booking_1.default.findAndCountAll({
            include: [{ model: table_1.default }],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
        });
        const rowCount = yield booking_1.default.count();
        const totalPage = Math.ceil(rowCount / limit);
        res.send({
            totalPage: totalPage,
            data: response.rows,
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getAll = getAll;
const verifyBooking = (req, res) => {
    bcrypt_1.default.compare(req.query.email, req.query.token, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (result) {
            yield booking_1.default.update({
                booking_status: 'confirm',
            }, {
                where: {
                    customer_email: req.query.email,
                },
            });
            res.send('Verify success');
        }
        else {
            res.send('This link not define');
        }
    }));
};
exports.verifyBooking = verifyBooking;
