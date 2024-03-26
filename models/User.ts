import { dbConnection } from "./dbInit";
import { DataTypes, Model, Optional } from "sequelize";
import { Credential } from "./Credential";

export interface UserAttributes {
  user_id: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_color: string;
  license_plate: string;
  tag_id?: number;
  first_name: string;
  last_name: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}


export const User = dbConnection.define<Model<UserAttributes, UserCreationAttributes>>('User', {
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
    underscored: true, 
});
