import { dbConnection } from './dbInit.js';
import { DataTypes, Optional, Model } from 'sequelize';

export interface LotAttributes {
	lot_id: number;
	lot_type: "commuter" | "resident" | "faculty" ;
	is_available: 0 | 1;
	auto_lot_id: number;
	bounding_box: { topLeft: [number, number], bottom_right: [number, number] };
}

// export interface LotCreationAttributes extends Optional<LotAttributes, 'lot_id'> {};

export const Lot = dbConnection.define(
	'Lot',
	{
		lot_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
		lot_type: {
			type: DataTypes.ENUM("commuter", "resident", "faculty"),
			allowNull: false,
		},
		is_available: {
			type: DataTypes.TINYINT,
			allowNull: true,
		},
        auto_lot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
        },
        bounding_box: {
            type: DataTypes.JSON,
            allowNull: true,
        },
	},
	{
		tableName: 'lots',
		timestamps: false,
		underscored: true,
	}
);
