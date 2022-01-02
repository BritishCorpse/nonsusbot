const { MessageEmbed } = require("discord.js");
const { paginateEmbeds } = require(`${__basedir}/functions`);

module.exports = {
    name: "changelog",
    description: "See what's new in the current version of Graveyard!",

    usage: [
    ],

    execute(message, args) {
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;

        const embeds = [
            new MessageEmbed()
                .setTitle("Changelog for Graveyard Version 1.1.4!")
                .setColor("ORANGE")
                .setFooter(`Do ${prefix}nerdstuff for the entire changelog.`),

            new MessageEmbed()
                .setTitle("New commands!")
                .setColor("ORANGE")
                .setDescription("Here are all the new commands for Graveyard version 1.1.4.")
                .addField("Toss a coin to earn or lose some money! (Does not require gambling pass)", `Usage: ${prefix}coinflip {bet} {heads or tails}.`)
                .addField("Guess the number, or don't?", `Usage: ${prefix}numbergame {bet} {lives}`),

            new MessageEmbed()
                .setTitle("We've updated the shop!")
                .setColor("ORANGE")
                .setDescription(`Check out the new items over at ${prefix}shop, and buy an item with ${prefix}buy!`)
        ];
        
        paginateEmbeds(message.channel, message.author, embeds);
    }
};
