// const { Sequelize } = require('sequelize');

// const db = new Sequelize(
//     'bo6vjvicpubskimc89zc',
//     'uhtwmprqicd1l7hw',
//     'oQkJuaD2Fs9FpC3tIabj',
//     {
//         host: 'bo6vjvicpubskimc89zc-mysql.services.clever-cloud.com',
//         dialect: 'mysql',
//         timezone: '+07:00',
//         define: {
//             timestamps: false,
//         },
//         logging: false,
//     }
// );
// let connectDB = async () => {
//     try {
//         await db.authenticate();
//         console.log('Connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };
// connectDB();
// export { db };

const { Sequelize } = require('sequelize');

const db = new Sequelize('pizza_restaurant', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00',
    define: {
        timestamps: false,
    },
    logging: false,
});
let connectDB = async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
connectDB();
export { db };
