import { Sequelize } from "sequelize";
import { Parking_Spot } from '../models/Parking_Spot';
import { Lot_Activity } from "./Lot_Activity";
import { State } from "../Enums";

interface ILocation {
    longitude: number,
    latitude: number
}

interface IDriverCache {
    tag_id: number,
    location: ILocation,
    locationUnchangedCount: number // Count how many times the location remains unchanged.
}

export default class Parkinator {
    private static lastFiveLocations: Array<IDriverCache> = [];

    constructor() {}

    private getNearbySpot(longitude: number, latitude: number) {
        // TODO: Port Tyler's geoquery code here
    }

    private updateSpot(spot_id: number) {
        // TODO: Update Parking_Spots table isAvailable and Lot_Activity pTimeIn, pTimeOut, timeslot, and day_of_week.
    }

    public determineState(tag_id: number, longitude: number, latitude: number) {
        // TODO: utitlize above methods to determine if spot is taken and what state car is in.

    }
}