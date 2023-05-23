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
exports.bookingOfWeek = exports.verifyBooking = exports.getAll = exports.updateBooking = exports.create = exports.updateStatusTable = exports.getTableWait = exports.getNewTable = void 0;
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const table_1 = __importDefault(require("../model/table"));
const booking_1 = __importDefault(require("../model/booking"));
const mail_1 = require("../util/mail");
const formEmailBooking_1 = require("../custom/formEmailBooking");
const index_1 = require("./index");
//Function get new table available
const getNewTable = (tableSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTableId;
        //If table is null will get new table
        newTableId = yield table_1.default.findOne({
            attributes: ['id'],
            where: {
                [sequelize_1.Op.and]: {
                    table_used: false,
                    table_size: { [sequelize_1.Op.gte]: tableSize },
                },
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
//Get table pending
const getTableWait = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableWaitId = yield table_1.default.findOne({
            attributes: ['id'],
            where: {
                table_size: 0,
            },
        });
        return tableWaitId.id;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getTableWait = getTableWait;
//Function get new id of table
const getNewId = (TableType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newId = yield TableType.findOne({
            attributes: ['id'],
            order: [['id', 'DESC']],
        });
        return newId.id;
    }
    catch (err) {
        console.log(err);
    }
});
//Function update status of table
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
//Create booking
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTableId;
        let tableWaitId;
        const { customerName, email, phone, time, date, partySize, bookingStatus = 'pending', note = '', tableId = null, } = req.body;
        //If table id define => create by admin
        if (tableId) {
            (0, exports.updateStatusTable)(tableId);
        }
        //Auto get table when customer booking
        else {
            tableWaitId = yield (0, exports.getTableWait)();
        }
        yield booking_1.default.create({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            booking_date: (0, moment_1.default)(date),
            booking_time: time,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId ? tableId : tableWaitId,
            note: note,
        });
        const bookingNewId = yield getNewId(booking_1.default);
        bcrypt_1.default
            .hash(email, parseInt(process.env.BCRYPT_SALT))
            .then((hashEmail) => {
            const link = `${process.env.APP_URL}/booking/verify?email=${email}&token=${hashEmail}&id=${bookingNewId}`;
            (0, mail_1.sendMail)(email, 'Pizza Restaurant booking', (0, formEmailBooking_1.formEmail)({
                customerName,
                date,
                time,
                partySize,
                href: link,
            }));
        });
        res.send({
            message: 'Create booking success',
            action: 'add',
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.create = create;
//Update booking
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { customerName, email, phone, time, date, partySize, bookingStatus, note, tableId, } = req.body;
        //Check booking not is done or cancel
        const checkIsDisable = yield booking_1.default.findOne({
            where: {
                id: id,
                booking_status: {
                    [sequelize_1.Op.notIn]: ['cancel', 'done'],
                },
            },
        });
        if (checkIsDisable) {
            const tableWaitId = yield (0, exports.getTableWait)();
            const query = {
                customer_name: customerName,
                customer_email: email,
                customer_phone: phone,
                booking_date: (0, moment_1.default)(date),
                booking_time: time,
                party_size: partySize,
                booking_status: bookingStatus,
                table_id: tableId,
                note: note,
            };
            //If booking status is not equal [pending]
            if (bookingStatus !== 'pending' && tableId !== tableWaitId) {
                if (tableId) {
                    (0, exports.updateStatusTable)(tableId);
                }
                yield booking_1.default.update(query, {
                    where: {
                        id: id,
                    },
                });
                res.send({
                    message: 'Update booking success',
                    action: 'update',
                });
            }
            //If booking status is [done, cancel] and not have table id
            else if (['done', 'cancel'].includes(bookingStatus) &&
                tableId === tableWaitId) {
                yield booking_1.default.update(query, {
                    where: {
                        id: id,
                    },
                });
                res.send({
                    message: 'Update booking success',
                    action: 'update',
                });
            }
            //If status is [eat]
            else {
                res.send({
                    message: 'Cannot change status table when table is waiting',
                    action: 'warning',
                });
            }
        }
        else {
            res.send({
                message: 'This booking is disable',
                action: 'warning',
            });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateBooking = updateBooking;
//Get all booking
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, sortBy = 'id', orderBy = 'DESC', limit = 7, status = '', } = req.query;
        const offSet = (page - 1) * limit;
        const response = yield booking_1.default.findAndCountAll({
            include: [{ model: table_1.default }],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
            where: status ? { booking_status: status } : {},
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
//Verify booking from user
const verifyBooking = (req, res) => {
    bcrypt_1.default.compare(req.query.email, req.query.token, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (result) {
            yield booking_1.default.update({
                booking_status: 'confirm',
            }, {
                where: {
                    [sequelize_1.Op.and]: [
                        { customer_email: req.query.email },
                        { id: req.query.id },
                    ],
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
//Get booking of week
const bookingOfWeek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startOfWeek, endOfWeek } = (0, index_1.getWeek)();
    const result = yield booking_1.default.findAll({
        attributes: ['id', 'created_at'],
        where: {
            created_at: {
                [sequelize_1.Op.gt]: startOfWeek,
            },
        },
        order: [['created_at', 'DESC']],
    });
    const bookingFilter = result.map((booking) => {
        return {
            id: booking.id,
            date: (0, moment_1.default)(booking.created_at, 'YYYY.MM.DD').format('DD-MM-YYYY'),
        };
    });
    res.send(bookingFilter);
});
exports.bookingOfWeek = bookingOfWeek;
//remove booking after 1 day
// const removeOldBookingRecords = () => {
//     const oneWeekAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
//     Booking.destroy({
//         where: {
//             create_at: { [Op.lte]: oneWeekAgo },
//         },
//     });
// };
// setInterval(removeOldBookingRecords, 10 * 24 * 60 * 60 * 1000);
