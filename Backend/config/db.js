// backend/config/db.js
import dotenv from "dotenv";
dotenv.config(); // will automatically pick Backend/.env

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

export default sequelize;
