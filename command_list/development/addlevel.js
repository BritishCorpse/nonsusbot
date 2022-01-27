const { Levels } = require("../../db_objects");

module.exports = {
    name: "addlevel",
    developer: true,
    usage: [],
    async execute(message) {
        const userInDb = await Levels.findOne({
            where: { userId: message.author.id, guildId: message.channel.guild.id }
        });

        await Levels.update({exp: userInDb.reqExp}, {where: {userId: message.author.id, guildId: message.channel.guild.id}});
    }
};