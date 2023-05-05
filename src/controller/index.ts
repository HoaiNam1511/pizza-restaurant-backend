export interface Query {
    page: number;
    sortBy: string;
    orderBy: string;
    limit?: number;
}

export interface Params {
    id: number;
}

export const getNewId = async ({
    TableName,
}: {
    TableName: any;
}): Promise<number> => {
    const newId: { id: number } = await TableName.findOne({
        attributes: ['id'],
        order: [['id', 'DESC']],
    });
    return newId.id;
};
