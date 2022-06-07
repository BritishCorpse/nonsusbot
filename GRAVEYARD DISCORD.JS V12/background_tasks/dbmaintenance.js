const { Levels,  SelfRoleChannels, SelfRoleMessages, VerifyChannels, VerifyMessages, VerifyQuestions, VerifyRoles, Counting, AutoRoleRoles } = require(`${__basedir}/db_objects.js`);

module.exports = {
    name: "dbmaintenance",
    execute(client) {
        // remove user level when they leave the server.
        client.on("guildMemberRemove", async guildMember => {
            await Levels.delete({
                where: {
                    userId: guildMember.user.id
                }
            });
        });
        // user warns should be kept even if they leave the server, just in case they rejoin.
        // remove guild information when the bot leaves the server.
        client.on("guildDelete", async guild => {
            await Levels.delete({
                where: {
                    guildId: guild.id
                }
            });

            await SelfRoleChannels.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await AutoRoleRoles.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await VerifyChannels.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await VerifyMessages.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await VerifyQuestions.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await SelfRoleMessages.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await VerifyRoles.delete({
                where: {
                    guild_id: guild.id
                }
            });

            await Counting.delete({
                where: {
                    guildId: guild.id
                }
            });
        });
    }
};