// TODO: Make userId a GraphQL User object instead to allow for resolver chaining.

export const scheduleTypes = `
type Schedule {
    schedule_id: Int
    time_in: String
    day_of_week: Int
    event_name: String
    user: User
    lots: [Lot]
}

input ScheduleCreationInput {
    user_id: Int!
    time_in: Int!
    day_of_week: Int!
    event_name: String!
    lots: [LotCreationInput]
}

input PossibleScheduleInput {
    time_in: Int
    day_of_week: Int
    event_name: String
    lots: [PossibleLotInput]
}
`;

export const scheduleQuerySchema = `
schedules: [Schedule]
schedule(scheduleId: Int!): Schedule
scheduleByUser(userId: Int!): Schedule
`;

export const scheduleMutationSchema = `
createSchedule(userId: Int!, input: ScheduleCreationInput): Schedule
updateUserSchedule(userId: Int!, input: PossibleScheduleInput): Schedule
`;