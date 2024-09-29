import { scheduleQueries } from "./Schedules/resolvers.js";
import { tagQueries } from "./Tags/resolvers.js";
import { userQueries, userMutations } from "./Users/resolvers.js";



const queries = {
    ...userQueries,
    ...tagQueries,
    ...scheduleQueries
};

const mutations = {
    ...userMutations
};

export const resolvers = {
    Query: queries,
    Mutation: mutations,
};