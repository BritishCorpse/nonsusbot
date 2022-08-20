const guildMemberWarnings = require("../../../processDatabaseSchemas/guildMemberWarnings.js");
const guildModerationHistories = require("../../../processDatabaseSchemas/guildModerationHistories.js");

const { info } = require("../../../../../sources/colours.json");

module.exports = {
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],

    // eslint-disable-next-line consistent-return
    async execute({ data }) {
        const interaction = data.content;

        const user = await interaction.options.getMember("user");

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();
        const embedManager = new data.globalUtilitiesFolder.EmbedManager();

        if (await interaction.options.getSubcommand() === "add") {
            const reason = await interaction.options.getString("reason");

            await interaction.editReply(`Gave ${user} a warning for \`${reason}\``);

            // find the guild in the database
            const guildInDb = await databaseManager.find(guildModerationHistories, {
                guildId: interaction.guild.id,
            }, true);

            // update the guilds total warnings
            guildInDb.totalWarnings += 1;
            await guildInDb.save();

            // create a new warning in the database
            await databaseManager.create(guildMemberWarnings, {
                guildId: interaction.guild.id,
                userId: user.id,
                reason,
                warningId: guildInDb.totalWarnings,
            }, true);
        } else if (await interaction.options.getSubcommand() === "list") {

            const userWarnings = await databaseManager.findAll(guildMemberWarnings, {
                guildId: interaction.guild.id,
                userId: await interaction.options.getUser("user").id,
            }, false) || null;

            if (userWarnings === null) {
                return interaction.editReply("This user does not have any warnings.");
            }

            embedManager.createEmbed(`Warnings for ${interaction.options.getUser("user").username}`, null, [], null, null, info.decimal, null);

            let embedIndex = 0;

            for (let i = 0; i < userWarnings.length; ++i) {
                const warning = userWarnings[i];

                // eslint-disable-next-line no-magic-numbers
                if (i !== 0 && i % 10 === 0) {
                    embedManager.createEmbed(`Warnings for ${interaction.options.getUser("user").username}`, null, [], null, null, info.decimal, null);

                    embedIndex++;
                }

                embedManager.embeds[embedIndex].data.fields.push({
                    name: `Warning #${warning.warningId}`,
                    value: `Reason: ${warning.reason}`,
                });
            }

            await interaction.editReply({ embeds: embedManager.embeds });
        } else if (await interaction.options.getSubcommand() === "remove") {
            const warningId = await interaction.options.getNumber("id");

            const warning = await databaseManager.find(guildMemberWarnings, {
                guildId: interaction.guild.id,
                userId: user.id,
                warningId,
            }, false) || null;

            if (warning === null) {
                return interaction.editReply(`No warning found with the ID \`${warningId}\` for the user ${user}.`);
            }

            await databaseManager.delete(guildMemberWarnings, {
                guildId: interaction.guild.id,
                userId: user.id,
                warningId,
            });

            return interaction.editReply(`Deleted warning \`${warningId}\` from ${user}.`);
        }
    },
};
