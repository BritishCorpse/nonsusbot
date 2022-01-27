const { MessageEmbed } = require("discord.js");
const { Levels } = require("../../db_objects");

module.exports = {
    name: "level",
    description: "See your, or someone else's level!",
    usage: [],
    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const user = message.mentions.users.first() || message.author;
        
        if (user.bot) {return message.channel.send("Bots can't be ranked!");}

        const userInDb = await Levels.findOne({
            where: {userId: user.id, guildId: message.channel.guild.id}
        });

        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.username} is level ${userInDb.level || "0"}!`})
            .setDescription(`${userInDb.exp || "0"}/${userInDb.reqExp || "1000"} EXP`)
            .setImage(user.avatarURL())
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
    }
};