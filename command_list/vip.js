const { CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
const { Users } = require('../dbObjects')


module.exports = {
    name: 'vip',
    category: 'currency',
    description: 'Join the V.I.P group for a low price of 10 million coins!',
    async execute(message, args){
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: "VIP pass" 
                }
            }
        });

        const user = await Users.findOne({
            where: {
                user_id: message.member.id
            }
        });


        const userItems = await user.getItems();
        for (const userItem of userItems) {
            const userVIP = userItems.find(userItem => userItem.item_id == item.id);

            if (userVIP === undefined) {
                const prefix = message.client.serverConfig.get(message.guild.id).prefix;
                message.channel.send(`You do not have the VIP pass. See the ${prefix}shop to buy it.`);
            } else {
                message.channel.send("It appears you have the VIP pass. Welcome to the VIP Group!");

                const vipRole = await message.guild.roles.cache.get(message.client.serverConfig.get(message.guild.id).vip_role_id);
                message.member.roles.add(vipRole);
            }
        };

    }
};
