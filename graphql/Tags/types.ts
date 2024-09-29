export const tagSchema = `
type Tag {
    tagId: Int!
    serial_code: String
    user: User
}
`;

export const tagQuerySchema = `
tags: [Tag]
tag(tagId: Int!): Tag
`;

export const tagMutationSchema = ``;