const { SlashCommandBuilder } = require("@discordjs/builders");
const { userCurrency } = require("../../db_objects");

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addbalance")
        .setDescription("Give money to yourself")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("How many of this item to buy")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const amount = await interaction.options.getInteger("amount");

        userCurrency.addBalance(await interaction.user.id, amount);
        
        await interaction.reply(`${amount}${gravestone}'s have been added to the balance of ${await interaction.user}.`);
    },
};
