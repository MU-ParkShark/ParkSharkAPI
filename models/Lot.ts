import { dbConnection } from './dbInit';
import { DataTypes } from 'sequelize';

export const Lot = dbConnection.define(
	'Lot',
	{
		lot_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
