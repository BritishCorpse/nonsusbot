const { Users } = require("../../db_objects");

module.exports = {
    name: "addlevel",
    usage: [],
    async execute(message) {
        const userInDb = await Users.findOne({
            where: { user_id: message.author.id }
        });

        await Users.update({exp: userInDb.reqexp}, {where: {user_id: message.author.id}});
    }
};