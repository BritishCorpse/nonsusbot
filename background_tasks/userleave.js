const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "userleave",
    execute(client) {
        client.on("guildMemberRemove", (guildMember) => {
            const randomColor = Math.floor(Math.random()*16777215).toString(16);
            
            const channel = guildMember.guild.channels.cache.find(channel => channel.name.includes("welcome"));

            const embed = new MessageEmbed()
                .setTitle(`@${guildMember.displayName} left ${guildMember.guild.name}.`)
                .setColor(randomColor);

            channel.send({embeds: [embed]});
        });
    }
};