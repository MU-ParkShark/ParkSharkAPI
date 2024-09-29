import { BaseContext } from "@apollo/server";
import { Tag, TagAttributes } from "../../models/Tag.js";
import { User, UserAttributes } from "../../models/User.js";

interface FindTagArgs {
    tagId: number
}

export const tagQueries = {
    tags: async () => {
        try {
            const resTags = await Tag.findAll();
            const resUsers = await User.findAll();

            let response: any = [];

            const tags = resTags.map((resTag) => resTag.get({ plain: true }));
            const users = resUsers.map((resUser) => resUser.get({ plain: true }));

            tags.forEach((tag) => {
                const user = users.find(user => user.tag_id === tag.tag_id);
                response.push({tagId: tag.tag_id, serial_code: tag.serial_code, user});
            })

            return response;
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
    tag: async (_parent: BaseContext, args: FindTagArgs, _contextValue: BaseContext, _info: BaseContext) => {
        try { 
            const resTag = await Tag.findOne({
                where: {
                    tag_id: args.tagId
                }
            });

            const tag = resTag?.get({ plain: true }) as TagAttributes;
            const userId = tag.user_id;

            const resUser = await User.findOne({
                where: {
                    user_id: userId
                }
            });

            const user = resUser?.get({ plain: true }) as UserAttributes;

            return { tagId: tag.tag_id, serial_code: tag.serial_code, user };
        } catch (err: any) {
            throw new Error(err.message);
        }
    },
};

export const tagMutations = {};