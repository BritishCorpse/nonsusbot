const { Users } = require("../../db_objects");

module.exports = {
    name: "addexp",
    usage: [],
    async execute(message) {
        const userInDb = await Users.findOne({
            where: { user_id: message.author.id }
        });

        await userInDb.addExp();

        message.channel.send("exp added!");
        message.channel.send(`your exp is now ${await userInDb.exp}`);
    }
};