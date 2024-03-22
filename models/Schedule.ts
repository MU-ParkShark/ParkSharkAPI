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
    day_of_week: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lots: {
        type: DataTypes.JSON, // Stores the lots the user wants to associate the this schedule event.
        allowNull: true
    }
}, {
    tableName: "schedules",
    timestamps: false,
    underscored: true
});
