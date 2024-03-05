import { dbConnection } from "./dbInit";
import { DataTypes } from "sequelize";

export const User = dbConnection.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicle_make: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    vehicle_model: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    vehicle_year: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    vehicle_color: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    license_plate: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    tag_id: {
        type: DataTypes.INTEGER
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: "users",
    timestamps: false,
    underscored: true
});
