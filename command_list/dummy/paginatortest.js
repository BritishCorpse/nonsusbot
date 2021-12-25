const { MessageEmbed } = require('discord.js');
const { paginateEmbeds } = require(`${__basedir}/functions`);


module.exports = {
    name: 'paginatortest',
    description: "test paginator",
    execute (message, args) {
        const embeds = [];

        for (let i = 0; i < 4; ++i) {
            const embed = new MessageEmbed()
                .setTitle(`Idk ${Math.random()}`)
                .setDescription("test")
                .setFooter("i am the footer")
                .setColor("GREEN");
            embeds.push(embed);
        }

        paginateEmbeds(message.channel, message.author, embeds);
    }
}
