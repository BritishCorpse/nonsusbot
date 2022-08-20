const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    userPermissions: ["VIEW_MESSAGES"],
    botPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MODERATE_MEMBERS"],

    data: new SlashCommandBuilder()
        .setName("moderation")
        .setDescription("Comprehensive system for server moderation")

        .addSubcommand(command => command
            .setName("timeout")
            .setDescription("Timeout a server member")

            .addUserOption(option => option
                .setName("user")
                .setRequired(true)
                .setDescription("The user to timeout"))

            .addStringOption(option => option
                .setName("reason")
                .setDescription("The reason to ban this user")

                .setRequired(true))

            .addStringOption(option => option
                .setName("duration")
                .setRequired(true)
                .setDescription("How long to timeout this member for")

                .addChoices(
                    { name: "A minute", value: "60000" },
                    { name: "Five minutes", value: "300000" },
                    { name: "Ten minutes", value: "600000" },
                    { name: "An hour", value: "3600000" },
                    { name: "A day", value: "86400000" },
                    { name: "A Week", value: "604800000" },
                )))

        .addSubcommand(command => command
            .setName("ban")
            .setDescription("Bans a user from the guild.")
            .addUserOption(option => option
                .setName("user")
                .setRequired(true)
                .setDescription("The user to ban"))
            .addBooleanOption(option => option
                .setName("deletemessages")
                .setRequired(true)
                .setDescription("Delete users previous messages"))
            .addStringOption(option => option
                .setName("reason")
                .setRequired(true)
                .setDescription("The reason to ban this user")))

        .addSubcommand(command => command
            .setName("unban")
            .setDescription("Unbans a user from the guild.")

            .addNumberOption(option => option
                .setName("user")
                .setRequired(true)
                .setDescription("The user id to unban"))

            .addStringOption(option => option
                .setName("reason")
                .setRequired(true)
                .setDescription("The reason to unban this user")))

        .addSubcommandGroup(group => group
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
        ),

    async execute({ data }) {
        // if youre wondering if this is necessary, yes.
        // discord has a slash command limit of 100 total.
        // if we want more than 100 "commands", we need to split them into subcommands and subcommand groups.
        const interaction = data.content;

        if (await interaction.options.getSubcommandGroup() === "warn") {
            const file = require("./moderationCommands/warn");

            return file.execute({ data });
        }

        const file = require(`./moderationCommands/${await interaction.options.getSubcommand()}`);

        return file.execute({ data });
    },
};
