const { Users } = require(`${__basedir}/db_objects`);
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "daily",
    description: "Claim your daily coins!",
    usage: [],
    
    async execute(message){
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const d = new Date();
        const time = d.getTime();

        const dailyMoney = 2000;

        const userInDb = await Users.findOne({ where: { user_id: message.author.id } });

        if (userInDb.lastDaily === null) {
            await Users.update({ lastDaily: time - 86400000 }, { where: { user_id: message.author.id } });
        }

        if (time - 86400000 < userInDb.lastDaily) {

            const embed1 = new MessageEmbed()
                .setTitle("You can't claim your daily yet!")
                .setColor(randomColor)
                .setDescription(`You can claim your next daily reward at: ${new Date(userInDb.lastDaily + 86400000).toGMTString()}`);

            message.channel.send({ embeds: [embed1] });
            return;
        }

        message.client.currency.add(message.author.id, dailyMoney);
        
        // Make sure they cant claim again in 24 hours.
        await Users.update({ lastDaily: time }, { where: { user_id: message.author.id } });

        const embed = new MessageEmbed()
            .setTitle("Your daily reward!")
            .setColor(randomColor)
            .setDescription(`You earned ${dailyMoney}<:ripcoin:929759319296192543>!`);

        message.channel.send({ embeds: [embed] });



    }
};