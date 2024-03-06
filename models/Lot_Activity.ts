import { dbConnection } from "./dbInit";
import { DataTypes } from "sequelize";

export const Lot_Activity = dbConnection.define(
  "Lot_Activity",
  {
    activity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    timeslot: {
      type: DataTypes.STRING,
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
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PARKED", "CANDIDATE", "VOID"),
      allowNull: false,
      defaultValue: "VOID",
    },
    tag_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "lot_activity",
    timestamps: false,
    underscored: true,
  },
);
