const { Users } = require('../db_objects');


module.exports = {
    name: 'inventory',
    category: "Currency",
    description: "Shows your inventory, or someone else's.",
    async execute (message, args) {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({
            where: {
                user_id: target.id
            }
        });

        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);
    }
}
