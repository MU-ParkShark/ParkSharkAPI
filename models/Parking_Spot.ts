import { dbConnection } from "./dbInit.js";
import { DataTypes, Optional } from "sequelize";

export interface ParkingSpotAttributes {
    spot_id?: number;
    is_handicap: 0 | 1;
    latlong: { longitude: number, latitude: number };
    is_available: 0 | 1;
    row_id: number;
    lot_id: number;
}

export interface ParkingSpotCreationAttributes extends Optional<ParkingSpotAttributes, 'spot_id'> {};

export const Parking_Spot = dbConnection.define('Parking_Spot', {
    spot_id: {
        type: DataTypes.INTEGER,
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