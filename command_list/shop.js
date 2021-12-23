const { CurrencyShop } = require('../dbObjects');


module.exports = {
    name: 'shop',
    category: "Currency",
    description: "See the shop",
    async execute (message, args) {
        const items = await CurrencyShop.findAll();
        message.channel.send(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'), {
            code: true
        });
    }
}
