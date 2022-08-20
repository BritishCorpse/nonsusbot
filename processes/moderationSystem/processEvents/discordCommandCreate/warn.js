const { SlashCommandBuilder } = require("@discordjs/builders");

const guildMemberWarnings = require("../../processDatabaseSchemas/guildMemberWarnings.js");
const guildModerationHistories = require("../../processDatabaseSchemas/guildModerationHistories.js");

// holy shit thats a lot of directory changing right there
const { info } = require("../../../../sources/colours.json");

module.exports = {
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warning commands")

        .addSubcommand(command => command
            .setName("add")
            .setDescription("Add a warning to a user")
            .addUserOption(option => option
                .setName("user")
                .setDescription("The user to add a warning to")
                .setRequired(true))
            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason to add a warning to this user")
                .setRequired(true)),
        )

        .addSubcommand(command => command
            .setName("list")
            .setDescription("List a users warnings")
            .addUserOption(option => option
                .setName("user")
                .setDescription("The user to list warnings of")
                .setRequired(true)),
        )

        .addSubcommand(command => command
            .setName("remove")
            .setDescription("Remove a warning from a user")
            .addUserOption(option => option
                .setName("user")
                .setDescription("The user to remove a warning from")
                .setRequired(true))
            .addNumberOption(option => option
                .setName("id")
                .setDescription("The id of the warning to remove")
                .setRequired(true)),
        ),

    // eslint-disable-next-line consistent-return
    async execute({ data }) {
        const interaction = data.content;

        const user = await interaction.options.getMember("user");

        const databaseManager = new data.globalUtilitiesFolder.DatabaseManager();

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
            }, false);

            const minWarningAmount = 1;

            if (userWarnings === null || userWarnings.length < minWarningAmount) {
                return interaction.editReply("This user does not have any warnings.");
            }

            const embedManager = new data.globalUtilitiesFolder.EmbedManager();

            const color = 1052853;

            embedManager.createEmbed(`Warnings for ${interaction.options.getUser("user").displayname}`, null, [], null, null, color, null);

            let embedIndex = 0;

            for (let i = 0; i < userWarnings.length; ++i) {
                const warning = userWarnings[i];

                // eslint-disable-next-line no-magic-numbers
                if (i !== 0 && i % 10 === 0) {
                    embedManager.createEmbed(`Warnings for ${interaction.options.getUser("user").username}`, null, [], null, null, color, null);

                    embedIndex++;
                }

                embedManager.embeds[embedIndex].data.fields.push({
                    name: `Warning #${warning.warningId}`,
                    value: `Reason: ${warning.reason}`,
                });
            }

            embedManager.addChannel(interaction.channel);

            embedManager.sendEmbeds(embedManager.embeds);

            await interaction.editReply("Here's what you requested.");
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
