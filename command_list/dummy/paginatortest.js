const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/functions`);


module.exports = {
    name: "paginatortest",
    description: "test paginator",
    
    usage: [
    ],

    execute (message) {
        const embeds = [

            new MessageEmbed()
                .setTitle("im a page")
                .setDescription("im a description")
                .setFooter({text: "hey im a footer"}),
            new MessageEmbed()
                .setTitle("im another page")
                .setDescription("im another description")
                .setFooter({text: "hey im another footer"}),

        ];
        
        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};
