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
                user_id: message.author.id
            }
        });


        const userItems = await user.getItems();
        for (const userItem of userItems) {
            const userVIP = userItems.find(userItem => userItem.name === item.name);

            if (userVIP !== undefined) {
                message.channel.send("It appears you have the VIP pass. Welcome to the VIP Group!");

                let role = message.member.guild.roles.cache.find(role => role.name === "VIP");
                if (role) message.guild.members.cache.get(message.author.id).roles.add(role);
            }

            else {
                return message.channel.send("It appears you do not possess the VIP pass. Please go to the _shop to buy it.");
            }
        };

    }
};