import { BaseContext } from "@apollo/server";
import { Schedule, ScheduleAttributes } from "../../models/Schedule.js";
import { Lot, LotAttributes } from "../../models/Lot.js";
import { User, UserAttributes } from "../../models/User.js";

interface FindScheduleByUserArgs {
    userId: number
}

interface FindScheduleArgs {
    scheduleId: number
}

interface ScheduleCreationInput {
    user_id: number,
    time_in: number,
    day_of_week: number,
    event_name: number,
    lots: [LotAttributes]
}

interface PossibleScheduleInput {
    time_in: number,
    day_of_week: number,
    event_name: String,
    lots: [LotAttributes]
}

export const scheduleQueries = {
    schedules: async () => {
        const schedules = await Schedule.findAll().then((resSchedules) => 
            resSchedules.map((resSchedule) => resSchedule.get({ plain: true }) as ScheduleAttributes)
        );
        const users = await User.findAll().then((resUsers) => 
            resUsers.map(resUser => resUser.get({ plain: true }) as UserAttributes)
        );
    
        const processSchedule = async (schedule: ScheduleAttributes) => {
            const user = users.find((user) => user.user_id === schedule.user_id);
    
            let rLots: LotAttributes[] = [];
    
            if (schedule.lots && schedule.lots.lot_ids) {
                const lotPromises = schedule.lots.lot_ids.map(async (lot_id: number) => {
                    const lot = await Lot.findOne({
                        where: { lot_id }
                    }).then((foundLot) => foundLot?.get({ plain: true }) as LotAttributes);

                    return lot;
                });
    
                rLots = await Promise.all(lotPromises);
            }

            return { 
                schedule_id: schedule.schedule_id,
                time_in: schedule.time_in,
                day_of_week: schedule.day_of_week,
                event_name: schedule.event_name,
                user,
                lots: rLots,
            };
        };
    
        const response = await Promise.all(schedules.map(processSchedule));
    
        return response;
    },
    scheduleByUser: async (_parent: BaseContext, args: FindScheduleByUserArgs, _contextValue: BaseContext, _info: BaseContext) => {
        try {
            const schedule = await Schedule.findOne({
                where: {
                    user_id: args.userId
                }
            }).then(resSchedule => resSchedule?.get({ plain: true }) as ScheduleAttributes);
        
            if (!schedule) {
                throw new Error('Schedule not found');
            }
        
            const user = await User.findOne({
                where: {
                    user_id: schedule.user_id
                }
            }).then((resUser) => resUser?.get({ plain: true }) as UserAttributes);
        
            let lots: LotAttributes[] = [];
        
            if (schedule.lots && Array.isArray(schedule.lots.lot_ids)) {
                const lotPromises = schedule.lots.lot_ids.map(async (lot_id) => {
                    const lot = await Lot.findOne({
                        where: {
                            lot_id
                        }
                    }).then(resLot => resLot?.get({ plain: true }) as LotAttributes);
                    return lot;
                });
        
                lots = await Promise.all(lotPromises);
            }
        
            return {
                schedule_id: schedule.schedule_id,
                time_in: schedule.time_in,
                day_of_week: schedule.day_of_week,
                event_name: schedule.event_name,
                user,
                lots,
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
    schedule: async (_parent: BaseContext, args: FindScheduleArgs, _contextValue: BaseContext, _info: BaseContext) => {
        try {
            const schedule = await Schedule.findOne({
                where: {
                    schedule_id: args.scheduleId
                }
            }).then(resSchedule => resSchedule?.get({ plain: true }) as ScheduleAttributes);
        
            if (!schedule) {
                throw new Error('Schedule not found');
            }
        
            const user = await User.findOne({
                where: {
                    user_id: schedule.user_id
                }
            }).then((resUser) => resUser?.get({ plain: true }) as UserAttributes);
        
            let lots: LotAttributes[] = [];
        
            if (schedule.lots && Array.isArray(schedule.lots.lot_ids)) {
                const lotPromises = schedule.lots.lot_ids.map(async (lot_id) => {
                    const lot = await Lot.findOne({
                        where: {
                            lot_id
                        }
                    }).then(resLot => resLot?.get({ plain: true }) as LotAttributes);
                    return lot;
                });
        
                lots = await Promise.all(lotPromises);
            }
        
            return {
                schedule_id: schedule.schedule_id,
                time_in: schedule.time_in,
                day_of_week: schedule.day_of_week,
                event_name: schedule.event_name,
                user,
                lots,
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
};

export const scheduleMutators = {
    createSchedule: async (_: any, args: { userId: number, input: ScheduleCreationInput }) => {
        const { userId, input } = args;
    },
    updateUserSchedule: async (_: any, args: { userId: number, input: PossibleScheduleInput }) => {
        const { userId, input } = args;
    }
};