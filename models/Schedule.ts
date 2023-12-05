import { dbConnection } from "./dbInit";
import { DataTypes } from "sequelize";

export const Schedule = dbConnection.define('Schedule', {
    schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time_in: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_out: {
        type: DataTypes.TIME,
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.TINYINT,
        allowNull: false
    }
});