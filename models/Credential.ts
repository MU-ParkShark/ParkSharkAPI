import { dbConnection } from './dbInit.js';
import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

export interface CredentialAttributes {
  id?: number;
  user_id: number;
  email: string;
  password: string;
}

export interface CredentialCreationAttributes extends Optional<CredentialAttributes, 'id'> {}

export const Credential = dbConnection.define<Model<CredentialAttributes, CredentialCreationAttributes>>('Credential', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'credentials',
  timestamps: false,
  underscored: true, 
  hooks: {
    beforeCreate: async (credential: any) => {
      const saltRounds = 10;
      credential.password = await bcrypt.hash(credential.password, saltRounds);
    },
  },
});


