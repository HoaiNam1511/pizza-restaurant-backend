import Table from '../model/table';
import { Request, Response } from 'express';

interface TableQuery {
    used: string;
}

export const getAll = async (
    req: Request<{}, {}, {}, TableQuery>,
    res: Response
) => {
    try {
        const { used }: TableQuery = req.query;
        let condition = {};
        if (used === 'true') {
            condition = {
                where: {
                    table_used: true,
                },
            };
        } else if (used === 'false') {
            condition = {
                where: {
                    table_used: false,
                },
            };
        }
        const result = await Table.findAll(condition);
        res.send(result);
    } catch (err) {
        console.log(err);
    }
};
