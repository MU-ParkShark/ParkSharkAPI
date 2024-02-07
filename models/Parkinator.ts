import { Sequelize } from "sequelize";
import { Parking_Spot } from '../models/Parking_Spot';
import { Lot_Activity } from "./Lot_Activity";
import { State } from "../Enums";

interface ILocation {
    longitude: number,
    latitude: number
}

export default class Parkinator {
    constructor() {}

    private static getNearbySpot(longitude: number, latitude: number) {
        // TODO: Port Tyler's geoquery code here
    }

    private static updateSpot(spot_id: number) {
        // TODO: Update Parking_Spots table isAvailable and Lot_Activity pTimeIn, pTimeOut, timeslot, and day_of_week.
    }

    private static updateCache(tag_id: string, location: ILocation, locationUnchangedCount: number) {
        
    }

    public determineState(tag_id: number, longitude: number, latitude: number) {
        // TODO: utitlize above methods to determine if spot is taken and what state car is in.
        let tag_id_string = `${tag_id}`;
        const location: ILocation = { longitude, latitude };
    }
}