export interface Query {
    page: number;
    sortBy: string;
    orderBy: string;
    limit?: number;
    status?: string;
    name?: string;
    orderStatus?: string;
    paymentStatus?: string;
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

export interface Week {
    startOfWeek: string;
    endOfWeek: string;
}

export const getWeek = (): Week => {
    const today = new Date();
    let startOfWeek: Date | string = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
    );

    startOfWeek = startOfWeek.toISOString().split('T')[0];

    let endOfWeek: Date | string = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    endOfWeek = endOfWeek.toISOString().split('T')[0];

    return {
        startOfWeek,
        endOfWeek,
    };
};
