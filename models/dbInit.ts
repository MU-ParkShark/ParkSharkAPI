import { Sequelize } from "sequelize";
require('dotenv').config();

const dbName = process.env.DB_NAME || 'parkshark';
const dbUser = process.env.DB_USER || 'root'; // Ensure env is configured, root is very unsafe.
const dbPass = process.env.DB_PASS || 'root'; // Ensure env is configured, root is very unsafe.

export const dbConnection: Sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql'
});