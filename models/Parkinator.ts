import { Sequelize } from "sequelize";
import { dbConnection } from "./dbInit"

export default class Parkinator {
    private dbConnection: Sequelize;

    constructor() {
        this.dbConnection = dbConnection;
    }
}