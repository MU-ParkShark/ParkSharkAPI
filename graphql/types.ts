export const typeDefs = `#graphql
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

type Query {
    users: [User]
}
`;