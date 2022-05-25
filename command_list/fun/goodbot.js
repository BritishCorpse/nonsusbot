const { GoodBot } = require("../../db_objects");

module.exports = {
    name: "goodbot",
    description: "Give me +1 goodbot rating!",
    usage: [],
    async execute(message) {
        const goodbots = await GoodBot.findOne({
            where: {
                id: 1
            }
        });

        message.reply(`Thank you! My good bot count is now ${goodbots.goodbots}`);

        goodbots.goodbots += 1;
        goodbots.save();
        
    }
};