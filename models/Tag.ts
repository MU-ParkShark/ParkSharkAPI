import { dbConnection } from './dbInit.js';
import { DataTypes, Optional, Model } from 'sequelize';

export interface TagAttributes {
  tag_id: number;
  user_id: number;
  serial_code: string;
}

export interface TagCreationAttributes extends Optional<TagAttributes, 'tag_id'> {}

export const Tag = dbConnection.define<Model<TagAttributes, TagCreationAttributes>>(
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
