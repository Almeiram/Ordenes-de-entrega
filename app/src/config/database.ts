import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
console.log("Database Host:", process.env.DB_HOST);
console.log("Database User:", process.env.DB_USER);
console.log("Database Name:", process.env.DB_NAME);

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST || "db",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        dialect: "postgres",
        logging: false, 
    }
);

export default sequelize;