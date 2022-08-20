const guildMemberModerationHistories = require("../../../processDatabaseSchemas/guildMemberModerationHistories");

module.exports = {
    async execute({ data }) {
        const interaction = data.content;

        const userToBan = await interaction.options.getMember("user");
        const reason = await interaction.options.getString("reason");

        userToBan.ban({ reason });

        await interaction.editReply(`Banned ${userToBan} from ${interaction.guild.name} for \`${reason}\``);

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

        const userInDb = await databaseManager.find(guildMemberModerationHistories, {
            guildId: interaction.guild.id,
            userId: await interaction.options.getUser("user").id,
        }, true) || null;

        userInDb.timesBanned += 1;
        userInDb.isBanned = true;

        await userInDb.save();
    },
};
