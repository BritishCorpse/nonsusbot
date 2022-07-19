const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reminder")
        .setDescription("Set a reminder so that you can be pinged for it later!")
        .addIntegerOption(option => 
            option
                .setName("duration")
                .setDescription("How long until you are reminded")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Minute/Hour/Day")
                .setRequired(true)
                .addChoices(
                    { name: "Hours", value: "3600000" },
                    { name: "Minutes", value: "60000" },
                    { name: "Days", value: "86400000" },
                )
        )
        .addStringOption(option => 
            option
                .setName("message")
                .setDescription("What I should say when the reminder is up")
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = await interaction.channel;
        const duration = await interaction.options.getInteger("duration") * await interaction.options.getString("type");
        const message = await interaction.options.getString("message");
        const user = await interaction.user;

        await interaction.reply("Reminder set.").then(() => {
            setTimeout(function() {channel.send(`${user}, you wanted me to remind you this: ${message}`);}, duration);
        });

    },
};
