import { BaseContext } from "@apollo/server";
import { User, UserAttributes, UserCreationAttributes } from "../models/User.js";
import { Credential, CredentialCreationAttributes, CredentialAttributes } from "../models/Credential.js";

interface FindUserArgs {
    id: number,
};

interface UserInput {
    vehicle_make: string,
    vehicle_model: string,
    vehicle_year: number,
    vehicle_color: string,
    license_plate: string,
    tag_id?: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
}

export const resolvers = {
    Query: {
        users: () => User.findAll(),
        user: (_parent: BaseContext, args: FindUserArgs, _contextValue: BaseContext, _info: BaseContext) => User.findOne({
            where: {
                user_id: args.id
            }
        }),
    },
    Mutation: {
        createUser: async (_: any, args: { input: UserInput }) => {
            try {
                const { input } = args;

                // Extract user data
                const userData: UserCreationAttributes = {
                    vehicle_make: input.vehicle_make,
                    vehicle_model: input.vehicle_model,
                    vehicle_year: input.vehicle_year,
                    vehicle_color: input.vehicle_color,
                    license_plate: input.license_plate,
                    tag_id: input.tag_id || undefined,
                    first_name: input.first_name,
                    last_name: input.last_name
                };

                // Create the user record
                const newUser = await User.create(userData);
                const user = newUser.get({ plain: true }) as UserAttributes;

                // Extract credential data
                const credentialData: CredentialCreationAttributes = {
                    user_id: user.user_id,
                    email: input.email,
                    password: input.password
                };

                // Create the credential record
                const newCredential = await Credential.create(credentialData);
                const credential = newCredential.get({ plain: true }) as CredentialAttributes;

                return { 
                    user, 
                    credential: {
                        credential_id: credential.id,
                        user_id: credential.user_id,
                        email: credential.email
                    }
                };
            } catch (error: any) {
                console.error('Error creating user:', error);
                throw new Error('Failed to create user: ' + error.message);
            }
        }
    },
};