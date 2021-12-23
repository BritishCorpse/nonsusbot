const { CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');


module.exports = {
    name: 'buy',
    category: "Currency",
    description: "Buy an item.",
    async execute (message, args) {
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: args[0] 
                }
            }
        });

        if (!item) return message.channel.send('That item doesn\'t exist.');

        if (item.cost > message.client.currency.getBalance(message.author.id)) {

            return message.channel.send(`You don't have enough currency, ${message.author.username}`);
        }

        message.reply(`You bought ${item.name}`)
        const user = await Users.findOne({
            where: {
                user_id: message.author.id
            }
        });
        message.client.currency.add(message.author.id, -item.cost);
        await user.addItem(item);
    }
}
