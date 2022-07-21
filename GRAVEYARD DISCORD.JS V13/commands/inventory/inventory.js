const { SlashCommandBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");

const { userInventory, currencyShop } = require(`${__basedir}/db_objects.js`);

const { gravestone } = require(`${__basedir}/configs/emojis.json`);

const { info } = require(`${__basedir}/configs/colors.json`);

const { EmbedButtonManager, Embed } = require("../../utilities/generalClasses.js");

const paginator = new EmbedButtonManager;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your inventory"),

    async execute(interaction) {
        await interaction.reply({ content: "Opening your inventory..." });

        // get the users items
        const userItems = await userInventory.getItems(interaction.user.id);

        // complain if the user doesn't have any items.
        if (userItems.length < 1) {
            return interaction.channel.send("Doesn't seem like you have any items. Sorry!");
        }

        // declare array where we will store our embeds
        const inventoryEmbeds = [];
        
        // declare inventory embed
        let inventoryEmbed = new Embed(`${interaction.user.username}'s inventory`, null, null, null, null, info);

        for (let i = 0; i < userItems.length; ++i) {
            if (i % 10 === 0) {
                //make new embed
                inventoryEmbed = new Embed(`${interaction.user.username}'s inventory`, null, null, null, null, info);

                //push the embed into the embeds array
                inventoryEmbeds.push(inventoryEmbed);
            }

            const item = await currencyShop.findOne({
                where: {
                    itemId: userItems[i].itemId
                }
            });

            // we don't delete the item from the users inventory if they sell all of it to reduce disk writing wear and tear.
            if (item.amount < 1) continue;

            // here we check the properties of the item in the inventory, and in the shop
            // if certain criteria are met, we add special "flags" to the item to be displayed in the embed, eg. "item is not available" 
            const embedFieldTitle = `${item.itemName}: ${item.itemDescription}`;
            let embedFieldDescription = "";

            embedFieldDescription += `\nOwned: ${userItems[i].amount}`;
            embedFieldDescription += `\nCategory: ${item.itemCategory}`;
            embedFieldDescription += `\nCost: ${item.itemCost}${gravestone}`;
        
            if (item.isAvailableToBuy === false) embedFieldDescription += "\n⚠️NOT PURCHASEABLE⚠️";
            if (item.itemCategory === "developer") embedFieldDescription += /*i have no idea why vscode flags these as invisible*/"\n⚠️DEVELOPER ITEM⚠️";
            
            inventoryEmbed.addFields([
                { name: embedFieldTitle, value: embedFieldDescription }
            ]);
        }

        //loop through the inventoryembeds array and remove any embeds that don't have any fields
        for (let i = 0; i < inventoryEmbeds.length; ++i) {
            if (inventoryEmbeds[i].data.fields.length === 0) {
                inventoryEmbeds.splice(inventoryEmbeds[i], 1);
            }
        }

        const message = await interaction.channel.send({ embeds: [inventoryEmbeds[0]] });

        const buttons = [
            {
                buttonType: "next",
                buttonText: "Next",
                buttonStyle: ButtonStyle.Primary
            },
            {
                buttonType: "previous",
                buttonText: "Back",
                buttonStyle: ButtonStyle.Primary
            },
            {
                buttonType: "start",
                buttonText: "Start",
                buttonStyle: ButtonStyle.Secondary
            },
            {
                buttonType: "end",
                buttonText: "End",
                buttonStyle: ButtonStyle.Secondary
            }
        ];

        // adds the buttons to an array with messageComponentrows
        await paginator.addButtons(buttons);

        // adds all of the messageComponentRows to the message.
        await paginator.pushButtons(message, interaction.channel);

        // wait for the user to press a button
        await paginator.collectButtonPresses(interaction.channel, interaction.user.id, /*provide a time limit in seconds*/60, inventoryEmbeds, message);
    },
};
