import { dbConnection } from "./dbInit";
import { DataTypes } from "sequelize";

export const Tag_Activity = dbConnection.define(
  "Tag_Activity",
  {
    tag_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: true,
    },
    update_timestamp: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    location_unchanged_counter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("IN PROGRESS", "PARKED", "VOID"),
      allowNull: true,
    },
  },
  {
    tableName: "tag_activity",
    timestamps: false,
    underscored: true,
  },
);
