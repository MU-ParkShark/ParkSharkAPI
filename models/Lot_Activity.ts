import { dbConnection } from './dbInit';
import { DataTypes } from 'sequelize';

export const Lot_Activity = dbConnection.define(
	'Lot_Activity',
	{
		activity_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		timeslot: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		day_of_week: {
			type: DataTypes.TINYINT,
			allowNull: false,
		},
		ptime_in: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		ptime_out: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		spot_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: 'lot_activity',
		timestamps: false,
		underscored: true,
	}
);
