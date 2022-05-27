const { GoodBot } = require("../../db_objects");

module.exports = {
    name: "badbot",
    description: "Give me +1 badbot rating!",
    usage: [],
    async execute(message) {
        const goodbots = await GoodBot.findOne({
            where: {
                id: 2
            }
        });

        message.reply(`:( My bad bot count is now ${goodbots.goodbots}.`);

        goodbots.goodbots += 1;
        goodbots.save();
    }
};