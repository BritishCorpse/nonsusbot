const { Op } = require('sequelize');
const { Users, CurrencyShop } = require(`${__basedir}/db_objects`);


module.exports = {
    name: 'buy',
    description: "Buys an item from the shop.",
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
            return message.channel.send(`You don't have enough currency, ${message.author.username}`);
        }

        message.reply(`You bought ${item.itemEmoji}${item.name}.`);
        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        message.client.currency.add(message.author.id, -item.cost);
        await user.addItem(item);
    }
}
