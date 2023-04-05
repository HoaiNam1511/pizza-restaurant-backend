const { Sequelize } = require('sequelize');

const db = new Sequelize('pizza_restaurant', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
    logging: false,
  }, );
let connectDB = async () => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
connectDB();
export {db}
