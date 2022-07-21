const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const { EmbedButtonManager, Embed } = require("../../utilities/generalClasses");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embedbuttonmanagertest")
        .setDescription("command to test the embed button manager."),
        
    async execute(interaction) {
        await interaction.reply("Starting test.");

        const testClass = new EmbedButtonManager;

        const embeds = [];

        for (let i = 1; i < 11; ++i){
            embeds.push(new Embed(`This is an embed title! Page number is: ${i}`, null, null, null, null, null, null));
        }


        const message = await interaction.channel.send({ content: "Hello there!", embeds: [embeds[0]] });

        // an array of buttons we want to add to the message
        const buttons = [
            {
                buttonType: "next",
                buttonText: "Next",
                buttonStyle: ButtonStyle.Primary
            },
            {
                buttonType: "previous",
                buttonText: "Back",
                buttonStyle: ButtonStyle.Secondary
            },
            {
                buttonType: "start",
                buttonText: "Start",
                buttonStyle: ButtonStyle.Success
            },
            {
                buttonType: "end",
                buttonText: "End",
                buttonStyle: ButtonStyle.Danger
            }
        ];

        // adds the buttons to an array with messageComponentrows
        await testClass.addButtons(buttons);

        // adds all of the messageComponentRows to the message.
        await testClass.pushButtons(message, interaction.channel);

        // wait for the user to press a button
        await testClass.collectButtonPresses(interaction.channel, interaction.user.id, /*provide a time limit in seconds*/60, embeds, message);
    },
};

