import { userTypes, userQuerySchema, userMutationSchema } from "./Users/types.js";
import { tagSchema, tagQuerySchema, tagMutationSchema } from "./Tags/types.js";
import { scheduleQuerySchema, scheduleTypes } from "./Schedules/types.js";
import { lotTypes } from "./Lots/types.js";

export const typeDefs = `#graphql
${userTypes}
${tagSchema}
${scheduleTypes}
${lotTypes}
type Query {
    ${userQuerySchema}
    ${tagQuerySchema}
    ${scheduleQuerySchema}
}

type Mutation {
    ${userMutationSchema}
}
`;