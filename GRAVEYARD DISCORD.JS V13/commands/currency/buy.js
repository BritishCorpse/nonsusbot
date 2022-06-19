const { SlashCommandBuilder } = require("@discordjs/builders");
const { userCurrency, currencyShop, userInventory } = require("../../db_objects");

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item.")
        .addSubcommand(subcommand => 
            subcommand
                .setName("food")
                .setDescription("Buy a food item")
                .addStringOption(option =>
                    option
                        .setName("item")
                        .setDescription("The item to buy")
                        .setRequired(true)
                        .addChoices(
                            { name: "carrot", value: "1000" }
                        )
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("How many of this item to buy")
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        await interaction.deferReply();

        let item = await interaction.options.getString("item");
        item = await currencyShop.getItem(item);

        const amount = await interaction.options.getInteger("amount");

        const totalCost = item.itemCost * amount;

        const balance = await userCurrency.getBalance(interaction.user.id);

        if (balance < totalCost) return await interaction.editReply(`You don't have enough ${gravestone}'s for that!`);

        //* give the user the item
        await userInventory.addItem(interaction.user.id, item.itemId, amount);

        //* remove the money from the user
        await userCurrency.addBalance(interaction.user.id, -totalCost);

        await interaction.editReply(`You bought ${amount} of the item \`${item.itemName}\` for ${totalCost}${gravestone}'s`);
    },
};
