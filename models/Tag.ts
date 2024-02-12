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
		},
	},
	{
		tableName: 'tags',
		timestamps: false,
		underscored: true,
	}
);
