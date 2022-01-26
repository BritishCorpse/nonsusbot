const { Op } = require("sequelize");
const { CurrencyShop, UserItems } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "sell",
    description: "Sell an item from your inventory.",

    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}} }
        )
    ],

    async execute (message, args) {
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!item) return message.channel.send("That item doesn't exist.");

        // Find the item in the users inventory.
        const itemInDb = await UserItems.findOne({
            where: { user_id: message.author.id, item_id: item.id}
        });
        
        // Check if the item is in the inventory.
        if (!itemInDb) {
            message.channel.send("You do not own this item!");
            return;
        }
        
        // Check if amount is a positive integer, to prevent negative integers in the database.
        if (itemInDb.amount < 1) {
            message.channel.send("You do not own this item!");
            return;
        }

        // Remove 1 item from the user.
        itemInDb.amount -= 1;
        itemInDb.save();

        // Add the money of the items cost to the user.
        message.client.currency.add(message.author.id, item.cost);

        // Send success message.
        message.channel.send(`You sold 1 ${item.name} for ${item.cost}<:ripcoin:929759319296192543>!`);
    }
};
