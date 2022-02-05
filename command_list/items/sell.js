const { Op } = require("sequelize");
const { CurrencyShop, UserItems } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "sell",
    description: "Sell an item from your inventory.",

    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()]/}, isempty: {not: null}, isinteger: {not: null}} } // is integer check needed if there is an amount given
        ),
        { tag: "amount", checks: {isinteger: null},
            next: [
                circularUsageOption(
                    { tag: "item", checks: {matches: {not: /[^a-zA-Z?!.,;:'"()]/}, isempty: {not: null}, isinteger: {not: null}} }
                )
            ]
        }
    ],

    async execute (message, args) {
        let amount = 1;
        if (Number.parseInt(args[0]).toString() === args[0]) {
            amount = Number.parseInt(args.shift());
        }

        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args.join(" ")
                }
            }
        });

        if (!item) {
            message.channel.send("That item doesn't exist.");
            return;
        }

        // Find the item in the users inventory.
        const itemInDb = await UserItems.findOne({
            where: { user_id: message.author.id, item_id: item.id}
        });
        
        
        // Check if the item is in the inventory.
        if (!itemInDb) {
            message.channel.send("You do not own this item!");
            return;
        }
        
        // Check if user has enough of the item (also prevents negative numbers)
        if (itemInDb.amount < amount) {
            message.channel.send("You do not own enough of this item!");
            return;
        }


        // Remove 1 item from the user.
        itemInDb.amount -= amount;
        itemInDb.save();


        // Add the money of the items cost to the user.
        message.client.currency.add(message.author.id, item.cost * amount);

        // Send success message.
        message.channel.send(`You sold ${amount} ${item.name} for ${item.cost * amount}<:ripcoin:929759319296192543>!`);
    }
};
