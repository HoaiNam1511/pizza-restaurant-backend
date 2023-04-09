import Table from '../model/table';
import { Request, Response } from 'express';

export const getAll = async (req: Request, res: Response) => {
    try {
        const result = await Table.findAll({
            where: {
                table_used: false,
            },
        });
        res.send(result);
    } catch (err) {
        console.log(err);
    }
};
