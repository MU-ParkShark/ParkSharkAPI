import { User } from "../models/User.js";

export const resolvers = {
    Query: {
        users: () => User.findAll(),
    },
};