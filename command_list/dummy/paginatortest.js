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

        ];
        
        paginateEmbeds(message.channel, message.author, embeds, {useDropdown: true});
    }
};
