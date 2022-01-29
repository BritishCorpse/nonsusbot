const { MessageEmbed } = require("discord.js");
const { Levels } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "level",
    description: "See your, or someone else's level!",
    usage: [],
    async execute(message) {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        const user = message.mentions.users.first() || message.author;
        
        if (user.bot) {
            message.channel.send("Bots can't be ranked!");
            return;
        }

        const userInDb = await Levels.findOne({
            where: {userId: user.id, guildId: message.guild.id}
        }) || {}; // this makes it an empty object if it is null

        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.username} is level ${userInDb.level || "0"}!`})
            .setDescription(`${userInDb.exp || "0"}/${userInDb.reqExp || "1000"} EXP`)
            .setImage(user.avatarURL())
            .setColor(randomColor);

        message.channel.send({embeds: [embed]});
    }
};
