import moment from 'moment';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Request, Response } from 'express';

import Table from '../model/table';
import Booking from '../model/booking';
import { Query } from './index';
import { sendMail } from '../util/mail';
import { formEmail } from '../custom/formEmailBooking';
import { getWeek, Week } from './index';
interface Booking {
    customerName: string;
    email: string;
    phone: string;
    time: Date;
    date: Date;
    partySize: number;
    bookingStatus: string;
    note: string;
    tableId: number | null;
}

interface BookingParam {
    id: number;
}

interface QueryVerify {
    email: string;
    token: string;
    id: number;
}

//Function get new table available
export const getNewTable = async (
    tableSize: number
): Promise<number | undefined> => {
    try {
        let newTableId: { id: number };
        //If table is null will get new table
        newTableId = await Table.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: {
                    table_used: false,
                    table_size: { [Op.gte]: tableSize },
                },
            },
        });
        updateStatusTable(newTableId.id);
        return newTableId.id;
    } catch (err) {
        console.log(err);
    }
};

//Get table pending
export const getTableWait = async () => {
    try {
        const tableWaitId = await Table.findOne({
            attributes: ['id'],
            where: {
                table_size: 0,
            },
        });
        return tableWaitId.id;
    } catch (err) {
        console.log(err);
    }
};

//Function get new id of table
const getNewId = async (TableType: any) => {
    try {
        const newId = await TableType.findOne({
            attributes: ['id'],
            order: [['id', 'DESC']],
        });
        return newId.id;
    } catch (err) {
        console.log(err);
    }
};

//Function update status of table
export const updateStatusTable = async (tableId: number) => {
    try {
        //Get table update status
        const currentTable = await Table.findOne({
            attributes: ['table_used'],
            where: {
                id: tableId,
            },
        });
        //Update status
        await Table.update(
            {
                table_used: !currentTable.table_used,
            },
            {
                where: {
                    id: tableId,
                },
            }
        );
    } catch (err) {
        console.log(err);
    }
};

//Create booking
export const create = async (
    req: Request<{}, {}, Booking, {}>,
    res: Response
) => {
    try {
        let newTableId: number | undefined | null;
        let tableWaitId: number | undefined | null;
        const {
            customerName,
            email,
            phone,
            time,
            date,
            partySize,
            bookingStatus = 'pending',
            note = '',
            tableId = null,
        }: Booking = req.body;

        //If table id define => create by admin
        if (tableId) {
            updateStatusTable(tableId);
        }
        //Auto get table when customer booking
        else {
            tableWaitId = await getTableWait();
        }

        await Booking.create({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            booking_date: moment(date),
            booking_time: time,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId ? tableId : tableWaitId,
            note: note,
        });

        const bookingNewId = await getNewId(Booking);

        bcrypt
            .hash(email, parseInt(process.env.BCRYPT_SALT as string))
            .then((hashEmail) => {
                const link = `${process.env.APP_URL}/booking/verify?email=${email}&token=${hashEmail}&id=${bookingNewId}`;
                sendMail(
                    email,
                    'Pizza Restaurant booking',
                    formEmail({
                        customerName,
                        date,
                        time,
                        partySize,
                        href: link,
                    })
                );
            });

        res.send({
            message: 'Create booking success',
            action: 'add',
        });
    } catch (err) {
        console.log(err);
    }
};

//Update booking
export const updateBooking = async (
    req: Request<BookingParam, {}, Booking, {}>,
    res: Response
) => {
    try {
        const { id }: BookingParam = req.params;
        const {
            customerName,
            email,
            phone,
            time,
            date,
            partySize,
            bookingStatus,
            note,
            tableId,
        }: Booking = req.body;

        //Check booking not is done or cancel
        const checkIsDisable = await Booking.findOne({
            where: {
                id: id,
                booking_status: {
                    [Op.notIn]: ['cancel', 'done'],
                },
            },
        });

        if (checkIsDisable) {
            const tableWaitId = await getTableWait();
            const query = {
                customer_name: customerName,
                customer_email: email,
                customer_phone: phone,
                booking_date: moment(date),
                booking_time: time,
                party_size: partySize,
                booking_status: bookingStatus,
                table_id: tableId,
                note: note,
            };
            //If booking status is not equal [pending]
            if (bookingStatus !== 'pending' && tableId !== tableWaitId) {
                if (tableId) {
                    updateStatusTable(tableId);
                }
                await Booking.update(query, {
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
            else if (
                ['done', 'cancel'].includes(bookingStatus) &&
                tableId === tableWaitId
            ) {
                await Booking.update(query, {
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
        } else {
            res.send({
                message: 'This booking is disable',
                action: 'warning',
            });
        }
    } catch (err) {
        console.log(err);
    }
};

//Get all booking
export const getAll = async (
    req: Request<{}, {}, {}, Query>,
    res: Response
) => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
            status = '',
        }: Query = req.query;

        const offSet = (page - 1) * limit;
        const response = await Booking.findAndCountAll({
            include: [{ model: Table }],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
            where: status ? { booking_status: status } : {},
        });

        const rowCount = await Booking.count();
        const totalPage = Math.ceil(rowCount / limit);

        res.send({
            totalPage: totalPage,
            data: response.rows,
        });
    } catch (err) {
        console.log(err);
    }
};

//Verify booking from user
export const verifyBooking = (
    req: Request<{}, {}, {}, QueryVerify>,
    res: Response
) => {
    bcrypt.compare(req.query.email, req.query.token, async (err, result) => {
        if (result) {
            await Booking.update(
                {
                    booking_status: 'confirm',
                },
                {
                    where: {
                        [Op.and]: [
                            { customer_email: req.query.email },
                            { id: req.query.id },
                        ],
                    },
                }
            );
            res.send('Verify success');
        } else {
            res.send('This link not define');
        }
    });
};

//Get booking of week
export const bookingOfWeek = async (
    req: Request<{}, {}, {}, {}>,
    res: Response
) => {
    const { startOfWeek, endOfWeek }: Week = getWeek();
    const result = await Booking.findAll({
        attributes: ['id', 'created_at'],
        where: {
            created_at: {
                [Op.gt]: startOfWeek,
            },
        },
        order: [['created_at', 'DESC']],
    });

    const bookingFilter = result.map((booking: any) => {
        return {
            id: booking.id,
            date: moment(booking.created_at, 'YYYY.MM.DD').format('DD-MM-YYYY'),
        };
    });

    res.send(bookingFilter);
};

//remove booking after 1 day
const removeOldBookingRecords = () => {
    const oneWeekAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    Booking.destroy({
        where: {
            create_at: { [Op.lte]: oneWeekAgo },
        },
    });
};

setInterval(removeOldBookingRecords, 10 * 24 * 60 * 60 * 1000);
