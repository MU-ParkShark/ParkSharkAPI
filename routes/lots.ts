import express, { Router } from "express";
import { Parking_Spot } from "../models/Parking_Spot";
import { Lot } from "../models/Lot";

export const lotsRouter: Router = express.Router();

lotsRouter.get('/', (_req, res) => {
    res.send('Lots endpoint hit.');
});

lotsRouter.get('/getLots', async (_req, res) => {
    try {
        const lots = await Lot.findAll();

        res.status(200).send(lots);
    } catch (error) {
        console.log(error);
        res.status(200).send(error);
    }
})

lotsRouter.get('/getOccupancy', async (_req, res) => {
    try {
        const allSpotCounts = await Parking_Spot.findAndCountAll({
            attributes: [
                'lot_id'
            ],
            group: ['lot_id'],
        });

        const occupiedSpotCounts = await Parking_Spot.findAndCountAll({
            attributes: [
                'lot_id'
            ],
            group: ['lot_id'],
            where: {
                is_available: 0
            }
        });

        res.status(200).send({ allSpotCounts, occupiedSpotCounts });
        } catch (error) {
            console.log(error);
            res.status(200).send("Unable to get occupancy.");
        }
})

lotsRouter.get('/getOccupancy/:id', async (req, res) => {
    try {
        const totalCount = await Parking_Spot.findAndCountAll({
            attributes: [
                'lot_id'
            ],
            where: {
                lot_id: parseInt(req.params.id)
            }
        });

        const occupiedCount = await Parking_Spot.findAndCountAll({
            where: {
                lot_id: parseInt(req.params.id),
                is_available: 0
            }
        });

        const relativeOccupancy = (occupiedCount.count/totalCount.count);

        res.status(200).json({
            lot_id: req.params.id,
            totalCount: totalCount.count,
            occupiedCount: occupiedCount.count,
            relativeOccupancy
        })
    } catch (error) {
        console.log(error);
        res.status(200).send('Unable to determine lot occupancy.');
    }
})
