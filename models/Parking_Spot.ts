import { dbConnection } from "./dbInit";
import { DataTypes } from "sequelize";

export const Parking_Spot = dbConnection.define('Parking_Spot', {
    spot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    is_handicap: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    latlong: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
    },
    is_available: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    row_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lot_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "parking_spots",
    timestamps: false,
    underscored: true
});