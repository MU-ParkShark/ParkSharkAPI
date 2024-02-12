import { Parking_Spot } from '../models/Parking_Spot';
import { Lot_Activity } from "./Lot_Activity";
import { Tag } from "./Tag";
import { State } from "../Enums";
import { QueryTypes } from 'sequelize';

interface ILocation {
    longitude: number,
    latitude: number
}

export default class Parkinator {
    constructor() {}

    private static getNearbySpot(longitude: number, latitude: number): Promise<number> {
        // TODO: Port Tyler's geoquery code here
        const promise: Promise<number> = new Promise((res, rej) => {
            res(0);
        })

        return promise;
    }

    private static updateSpot(spot_id: number) {
        // TODO: Update Parking_Spots table isAvailable and Lot_Activity pTimeIn, pTimeOut, timeslot, and day_of_week.
    }

    public async determineState(tag_id: number, longitude: number, latitude: number): Promise<State> {
        // TODO: utilize above methods to determine if spot is taken and what state car is in.
        const location: ILocation = { longitude, latitude };
        const tag = await Tag.findByPk(tag_id);

        const promise: Promise<State> = new Promise(async (res, rej) => {
            if (!tag || tag == null) {
                rej("Error - Cannot find tag with that id!");
            }

            const counter = tag?.getDataValue("unchanged_location_counter");

            if (counter >= 3) {
                const query = `SELECT *, ST_Distance_Sphere(latlong, POINT(${longitude}, ${latitude})) as distance FROM parking_spots ORDER BY distance LIMIT 1`;
                const spots: any[] | undefined = await Parking_Spot.sequelize?.query(query, {
                    type: QueryTypes.SELECT, // returns an array
                });
                
                if (!spots || spots.length === 0) throw new Error('No spots found.');

                Parkinator.updateSpot(spots[0].spot_id); // Issue here is that TypeScript cannot verify what type of spots is.
            } else {
                // TODO: Decode MySQL point to compare with given longitude and latitude.
                const last_latlong = tag?.getDataValue("last_latlong");   
            }

            res(State.UNDECIDED);
        });

        return promise;
    }
}