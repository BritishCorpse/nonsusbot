const { Users } = require(`${__basedir}/db_objects`);
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "daily",
    description: "Claim your daily coins!",
    usage: [],
    async execute(message, args){
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const d = new Date();
        let time = d.getTime();
        console.log(time);

        const dailyMoney = 2000;

        const userInDb = await Users.findOne({ where: { user_id: message.author.id } });

        if (userInDb.lastDaily === null) {
            await Users.update({ lastDaily: time - 86400000 }, { where: { user_id: message.author.id } });
        }

        if (time - 86400000 < userInDb.lastDaily) {
            return message.channel.send("SLOW DOWN! It hasn't been 24 hours yet since your last daily!");
        }

        message.client.currency.add(message.author.id, dailyMoney);
        
        // Make sure they cant claim again in 24 hours.
        await Users.update({ lastDaily: time }, { where: { user_id: message.author.id } });

        const embed = new MessageEmbed()
        .setTitle("Your daily reward!")
        .setColor(randomColor)
        .setDescription(`You earned ${dailyMoney}!!!!!!!!!!!!!!!`);

        message.channel.send({ embeds: [embed] });



    }
}