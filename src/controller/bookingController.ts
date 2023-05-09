import moment from 'moment';
import bcrypt from 'bcrypt';
const { Op } = require('sequelize');
import { Request, Response } from 'express';

import Table from '../model/table';
import Booking from '../model/booking';
import { Query } from './index';
import { sendMail } from '../util/mail';
import { formEmail } from '../custom/formEmailBooking';
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

export const getNewTable = async (
    tableSize: number
): Promise<number | undefined> => {
    try {
        let newTableId: { id: number };
        //If table is null will get new table
        newTableId = await Table.findOne({
            attributes: ['id'],
            where: {
                table_used: false,
                table_size: { [Op.gte]: tableSize },
            },
        });
        updateStatusTable(newTableId.id);
        return newTableId.id;
    } catch (err) {
        console.log(err);
    }
};

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

export const create = async (
    req: Request<{}, {}, Booking, {}>,
    res: Response
) => {
    try {
        let newTableId: number | undefined;
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

        if (!tableId) {
            newTableId = await getNewTable(partySize);
            if (newTableId) {
                updateStatusTable(newTableId);
            }
        } else {
            updateStatusTable(tableId);
        }

        //const booking = new Booking();

        await Booking.create({
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            booking_date: moment(date),
            booking_time: time,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId ? tableId : newTableId,
            note: note,
        });

        bcrypt
            .hash(email, parseInt(process.env.BCRYPT_SALT as string))
            .then((hashEmail) => {
                const link = `${process.env.APP_URL}/booking/verify?email=${email}&token=${hashEmail}`;
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

        res.send('created');
    } catch (err) {
        console.log(err);
    }
};

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

        if (bookingStatus === 'done' || bookingStatus === 'cancel') {
            if (tableId) {
                updateStatusTable(tableId);
            }
        }

        await Booking.update(
            {
                customer_name: customerName,
                customer_email: email,
                customer_phone: phone,
                booking_date: moment(date),
                booking_time: time,
                party_size: partySize,
                booking_status: bookingStatus,
                table_id: tableId,
                note: note,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        res.send('updated');
    } catch (err) {
        console.log(err);
    }
};

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
        }: Query = req.query;
        const offSet = (page - 1) * limit;
        const response = await Booking.findAndCountAll({
            include: [{ model: Table }],
            offset: page ? offSet : 0,
            limit: limit ? +limit : null,
            order: [[sortBy, orderBy]],
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

interface QueryVerify {
    email: string;
    token: string;
}

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
                        customer_email: req.query.email,
                    },
                }
            );
            res.send('Verify success');
        } else {
            res.send('This link not define');
        }
    });
};
