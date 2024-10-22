import { dbConnection } from "./dbInit";
import { DatabaseError, DataTypes} from "sequelize";
import { User } from "./User";
export const Alerts = dbConnection.define(
    'Alerts',
    {
        alert_id: {
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true,
        },
        posted_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'user_id'
            },
            // will wait on these until further clarification in requirements
            //onUpdate: 'CASCADE', // Update alerts if user Id is updated
            //onDelete: "RESTRICT", // will not allow deletetion until all alerts with certain user is deleted
            
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        eff_date: {
            type: DataTypes.DATE,
            allowNull:true,
         },
        end_date : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status : {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: 1,
        },
        title: {
            type: DataTypes.STRING(244),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(1024)
        }

    },
    {
        tableName: 'alerts',
        timestamps: false,
        underscored: true,
    }
);