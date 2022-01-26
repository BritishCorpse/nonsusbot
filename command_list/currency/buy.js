const { Op } = require("sequelize");
const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);
const { circularUsageOption } = require(`${__basedir}/functions`);


module.exports = {
    name: "buy",
    description: "Buys an item from the shop.",

    usage: [
        circularUsageOption(
            { tag: "item", checks: {matches: {not: /[^\w?!.,;:'"()#]/}, isempty: {not: null}} }
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

        if (item.cost > message.client.currency.getBalance(message.author.id)) {
            return message.channel.send(`You don't have enough <:ripcoin:929759319296192543>'s, ${message.author.username}`);
        }

        if (item.category === "Badges") {
            message.channel.send("Looks like you've bought a badge! We'll go ahead and apply that for you.");
            await Users.update({ badge: item.itemEmoji }, { where: { user_id: message.author.id } });
        }
        
        message.reply(`You bought ${item.itemEmoji}**${item.name}**.`);
        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });

        message.client.currency.add(message.author.id, -item.cost);

        await user.addItem(item);
        
    }
};
