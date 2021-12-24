const { CurrencyShop } = require('../dbObjects');
const { Op } = require('sequelize');
const { Users } = require('../dbObjects')
module.exports = {
    name: 'vip',
    category: 'currency',
    description: 'Join the V.I.P group for a low price of 10 million coins!',
    async execute(message, args){
        //Here we'll add a cool thing which checks if the user has a VIP pass in their inventory.
        const item = await CurrencyShop.findOne({
            where: {
                name: {
                    [Op.like]: "Cookie" 
                }
            }
        });

        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({
            where: {
                user_id: target.id
            }
        });

        const userItems = await user.getItems();

        for (const userItem of userItems) {
            const userVIP = userItems.find(userItem => userItem.name === item.name);

            if (userVIP === undefined) {
                return message.channel.send("Im complaining cause you dont have vip stupid idiot i hate you");
            }

            else {
                return message.channel.send("you have vip")
            }
        };

    }
};