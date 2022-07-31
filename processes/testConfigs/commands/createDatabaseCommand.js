const { SlashCommandBuilder } = require("@discordjs/builders");
const testSchema = require("../databaseSchemaTest");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testconfig")
        .setDescription("A command to test the config system.")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel to do verification in")
            .setRequired(true),
        )
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message to send in the verification channel"),
        ),

    async execute(interaction) {
        const messageContent = interaction.options.getString("message");
        const verificationChannel = interaction.options.getChannel("channel");

        const doc = await testSchema.findOne({ guildId: interaction.guild.id });

        if (doc) {
            doc.configs = {
                messageContent,
                channelId: verificationChannel.id,
            };

            doc.save();
        } else {
            testSchema.create({
                guildId: interaction.guild.id,
                configs: {
                    messageContent,
                    channelId: verificationChannel.id,
                },
            });
        }

        await interaction.reply("Updated confings");
    },
};
