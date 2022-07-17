const { SlashCommandBuilder } = require("@discordjs/builders");
const { makeEmbed } = require("../../utilities/generalFunctions");

const { paginateEmbeds } = require(`${__basedir}/utilities/generalFunctions.js`);
const { userInventory, currencyShop } = require(`${__basedir}/db_objects.js`);

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your inventory"),
        
    async execute(interaction) {
        await interaction.reply("Opening your inventory...");

        // get the users items
        const userItems = await userInventory.getItems(interaction.user.id);

        // declare array where we will store our embeds
        const inventoryEmbeds = [];
        
        // declare inventory embed
        let inventoryEmbed = await makeEmbed(interaction.client, `${interaction.user.username}'s inventory`, null, "BLUE", null);

        for (let i = 0; i < userItems.length; ++i) {
            if (i % 10 === 0) {
                //make new embed
                inventoryEmbed = await makeEmbed(interaction.client, `${interaction.user.username}'s inventory`, null, "BLUE", null);

                //push the embed into the embeds array
                inventoryEmbeds.push(inventoryEmbed);
            }

            const item = await currencyShop.findOne({
                where: {
                    itemId: userItems[i].itemId
                }
            });

            if (item.amount < 1) continue;

            inventoryEmbed.addField(`${item.itemName}: ${item.itemDescription}`, `Owned: ${userItems[i].amount}\nCategory: ${item.itemCategory}\nAvailable for purchase: ${item.isAvailableToBuy}\nCost: ${item.itemCost}${gravestone}`);
        }

        //loop through the inventoryembeds array and remove any embeds that don't have any fields
        for (let i = 0; i < inventoryEmbeds.length; ++i) {
            if (inventoryEmbeds[i].fields.length === 0) {
                inventoryEmbeds.splice(inventoryEmbeds[i], 1);
            }
        }

        await paginateEmbeds(interaction.channel, interaction.user, inventoryEmbeds);
    },
};
