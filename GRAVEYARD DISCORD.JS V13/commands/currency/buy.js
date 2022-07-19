const { SlashCommandBuilder } = require("@discordjs/builders");

const { userCurrency, currencyShop, userInventory } = require("../../db_objects");

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

const { shop } = require(`${__basedir}/utilities/shopItems.js`);

//* add all the items from shopItems.js to our categories
const foods = [];
const tools = [];
const cats = [];
const dogs = [];
const others = [];

for(let i = 0; i < shop.length; ++i) {
    const item = shop[i];

    //* allows us to disable items from being available
    if (item.isAvailableToBuy === false) continue;

    const category = item.itemCategory;

    if (category === "foods") foods.push({ name: item.itemName, value: `${item.itemId}`} );
    if (category === "tools") tools.push({ name: item.itemName, value: `${item.itemId}`} );
    if (category === "cats") cats.push({ name: item.itemName, value: `${item.itemId}`} );
    if (category === "dogs") dogs.push({ name: item.itemName, value: `${item.itemId}`} );
    if (category === "others") others.push({ name: item.itemName, value: `${item.itemId}`});
}

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
                            ...foods
                        )
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("How many of this item to buy")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("tools")
                .setDescription("Buy a tool item")
                .addStringOption(option =>
                    option
                        .setName("item")
                        .setDescription("The item to buy")
                        .setRequired(true)
                        .addChoices(
                            ...tools
                        )
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("How many of this item to buy")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("cats")
                .setDescription("Buy a cat")
                .addStringOption(option =>
                    option
                        .setName("item")
                        .setDescription("The item to buy")
                        .setRequired(true)
                        .addChoices(
                            ...cats
                        )
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("How many of this item to buy")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("dogs")
                .setDescription("Buy a food item")
                .addStringOption(option =>
                    option
                        .setName("item")
                        .setDescription("The item to buy")
                        .setRequired(true)
                        .addChoices(
                            ...dogs
                        )
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("How many of this item to buy")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("others")
                .setDescription("Buy something else")
                .addStringOption(option =>
                    option
                        .setName("item")
                        .setDescription("The item to buy")
                        .setRequired(true)
                        .addChoices(
                            ...others
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

        //* flags if the user does not have enough money
        if (balance < totalCost) return await interaction.editReply(`You don't have enough ${gravestone}'s for that!`);

        //* give the user the item
        await userInventory.addItem(interaction.user.id, item.itemId, amount);

        //* remove the money from the user
        await userCurrency.addBalance(interaction.user.id, -totalCost);

        await interaction.editReply(`You bought ${amount} of the item \`${item.itemName}\` for ${totalCost}${gravestone}'s`);
    },
};
