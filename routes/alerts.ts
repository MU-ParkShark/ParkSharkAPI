import express, { Router } from "express";
import { Alerts } from "../models/Alerts";
import { User } from "../models/User";
import { Sequelize } from "sequelize";
import bodyParser from "body-parser";

const { Op } = require('sequelize');
const jsonParser = bodyParser.json();

interface User {
    first_name: string;
    last_name: string;
  }
   
export const alertsRouter: Router = express.Router();

alertsRouter.get('/', (_req, res) => {
  res.send('Alerts endpoint hit.');
});

alertsRouter.get('/getAllAlerts', async (_req, res) => {
  try {
    const alerts = await Alerts.findAll({
      include: [{
        model: User,
        required: true,
        on: {
          col1: Sequelize.col('Alerts.posted_by'),
          col2: Sequelize.col('User.user_id'),
        },
        attributes: ['first_name', 'last_name'],
      }],
      attributes: ['alert_id', 'title', 'message', 'date_time','posted_by'],
    });

      const formattedAlerts = alerts.map(alert => {
        const user = alert.get('User') as User; // Get the User object directly
      
        return {
          alert_id: alert.get('alert_id'),
          title: alert.get('title'),
          message: alert.get('message'),
          date_time: alert.get('date_time'),
          userId: alert.get('posted_by'),
          username: user ? `${user.first_name} ${user.last_name}` : 'Unknown User' // Direct access
        };
      });
      
      res.status(200).json({
        alerts: formattedAlerts,
        totalAlerts: formattedAlerts.length
      });
    }
     catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching alerts.', error });
  }
});


alertsRouter.get('/getEffectiveAlerts', async (_req, res) => {
    try {
      const currentDateTime = new Date();

      const alerts = await Alerts.findAll({
        where : {
            status: {
                [Op.eq]: 1
            },
            eff_date : {
                [Op.lte]: currentDateTime
            },
            end_time: {
                [Op.gte]: currentDateTime
            }
        },
        include: [ {
            model:User,
            required:true,
            on: {
                col1:Sequelize.col('Alerts.posted_by'),
                col2:Sequelize.col('Users.user_id'),
            },
            attributes: ['first_name','last_name'],
        }],
        attributes: ['alert_id','title','message','date_time','posted_by'],

      });
      
   
        const formattedAlerts = alerts.map(alert => {
          const user = alert.get('User') as User; // Get the User object directly
        
          return {
            alert_id: alert.get('alert_id'),
            title: alert.get('title'),
            message: alert.get('message'),
            date_time: alert.get('date_time'),
            userId: alert.get('posted_by'),
            username: user ? `${user.first_name} ${user.last_name}` : 'Unknown User' // Direct access
          };
        });
        res.status(200).json({
          alerts: formattedAlerts,
          totalAlerts: formattedAlerts.length
        });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'An error occurred while fetching alerts.', error });
      }
    });

alertsRouter.delete('/deleteAlert/:id', async (req,res) =>{
  try{
    const alert = await Alerts.findOne({
      where : {
        'alert_id' : parseInt(req.params.id) // express extracts request query params and stores in 'req.params'
      }}
    );
    const response = await alert?.destroy();//Delete if alert exists '?.' handles if alert is null ( short-circuits and does not do desotry())
    res.status(200).send(response);
  }catch(error){
    console.log(error)
    res.status(500).json({ message: 'An error occurred while deleting alert.', error });
  }
});