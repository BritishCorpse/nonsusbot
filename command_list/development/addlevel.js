const { Users } = require("../../db_objects");

module.exports = {
    name: "addlevel",
    usage: [],
    async execute(message) {
        const userInDb = await Users.findOne({
            where: { user_id: message.author.id }
        });

        await userInDb.addLevel();

        message.channel.send("level added!");
        message.channel.send(`your level is now ${await userInDb.level}`);
    }
};