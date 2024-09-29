// TODO: Make tag_id a GraphQL Tag object to allow for resolver chains. Ensure Tag queries are properly set up first for this to work.

export const userTypes = `
type User {
    user_id: Int
    vehicle_make: String
    vehicle_model: String
    vehicle_year: Int
    vehicle_color: String
    license_plate: String
    tag_id: Int
    first_name: String
    last_name: String
}

type Credential {
    credential_id: Int!
    user_id: Int!
    email: String!
}

 type UserWithCredential {
    user: User!
    credential: Credential!
}

input UserInput {
    vehicle_make: String!
    vehicle_model: String!
    vehicle_year: Int!
    vehicle_color: String!
    license_plate: String!
    tag_id: Int
    first_name: String!
    last_name: String!
    email: String!
    password: String!
}

input PossibleUserInput {
    vehicle_make: String
    vehicle_model: String
    vehicle_year: Int
    vehicle_color: String
    license_plate: String
    tag_id: Int
    first_name: String
    last_name: String
    email: String
    password: String
}
`;

export const userQuerySchema = `
users: [User]
user(id: Int!): User
`;

export const userMutationSchema = `
createUser(input: UserInput!): UserWithCredential!
updateUser(id: Int!, input: PossibleUserInput): User
deleteUser(id: Int!): User
`;
