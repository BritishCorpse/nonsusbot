const { Users } = require(`${__basedir}/db_objects`);
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "weekly",
    description: "Claim your weekly coins!",
    usage: [],

    async execute(message){
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const d = new Date();
        const time = d.getTime();

        const weeklyMoney = 10000;

        const userInDb = await Users.findOne({ where: { user_id: message.author.id } });

        if (userInDb.lastWeekly === null) {
            await Users.update({ lastWeekly: time - 86400000 * 7 }, { where: { user_id: message.author.id } });
        }

        // Make sure they cant claim again in 7 days
        if (time - 86400000 * 7 < userInDb.lastWeekly) {

            const embed1 = new MessageEmbed()
                .setTitle("You can't claim your weekly yet!")
                .setColor(randomColor)
                .setDescription(`You can claim your next weekly reward at: ${new Date(userInDb.lastDaily + 86400000 * 7).toGMTString()}`);

            message.channel.send({ embeds: [embed1] });
            return;
        }

        message.client.currency.add(message.author.id, weeklyMoney);
        await Users.update({ lastWeekly: time }, { where: { user_id: message.author.id } });

        const embed = new MessageEmbed()
            .setTitle("Your weekly reward!")
            .setColor(randomColor)
            .setDescription(`You earned ${weeklyMoney}<:ripcoin:929759319296192543>!`);

        message.channel.send({ embeds: [embed] });
    }
};
