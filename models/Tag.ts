import { dbConnection } from './dbInit';
import { DataTypes } from 'sequelize';

export const Tag = dbConnection.define(
	'Tag',
	{
		tag_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		serial_code: {
			type: DataTypes.STRING(100),
			allowNull: false,
			defaultValue: "TESTESTESTESTESTEST",
		},
	},
	{
		tableName: 'tags',
		timestamps: false,
		underscored: true,
	}
);
