import Booking from '../model/booking';
import Table from '../model/table';
import { Request, Response } from 'express';
import { QueryParams } from './index';
import moment from 'moment';

interface Booking {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    bookingTime: Date;
    bookingDate: Date;
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
        newTableId = await Table.findOne(
            {
                attributes: ['id'],
            },
            {
                where: {
                    table_used: false,
                    table_size: tableSize,
                },
            }
        );
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
            customerEmail,
            customerPhone,
            bookingTime,
            bookingDate,
            partySize,
            bookingStatus,
            note,
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

        await Booking.create({
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            booking_date: moment(bookingDate),
            booking_time: bookingTime,
            party_size: partySize,
            booking_status: bookingStatus,
            table_id: tableId ? tableId : newTableId,
            note: note,
        });
        res.send('created');
    } catch (err) {
        console.log(err);
    }
};

export const update = async (
    req: Request<BookingParam, {}, Booking, {}>,
    res: Response
) => {
    try {
        const { id }: BookingParam = req.params;
        const {
            customerName,
            customerEmail,
            customerPhone,
            bookingTime,
            bookingDate,
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
                customer_email: customerEmail,
                customer_phone: customerPhone,
                booking_date: moment(bookingDate),
                booking_time: bookingTime,
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
    req: Request<{}, {}, {}, QueryParams>,
    res: Response
) => {
    try {
        const {
            page = 0,
            sortBy = 'id',
            orderBy = 'DESC',
            limit = 7,
        }: QueryParams = req.query;
        const offSet = (page - 1) * limit;
        const response = await Booking.findAndCountAll({
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
