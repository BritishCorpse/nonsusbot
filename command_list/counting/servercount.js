const { MessageEmbed } = require("discord.js");

const { Counting } = require(`${__basedir}/db_objects`);

module.exports = {
    name: "servercount",
    description: "See how many numbers the guild has counted!",
    usage: [],
    async execute(message) {
        // Find the prefix in the server config.
        const prefix = message.client.serverConfig.get(message.guild.id).prefix;


        //Random colour to show in the embed
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);

        
        // Find the guild in the database.
        const guildInDb = await Counting.findOne({
            where: {guildId: message.guild.id}
        });


        // If the guild doesnt exist in the database, just send an embed with null information.
        if (!guildInDb) {
            await Counting.create({
                guildId: message.guild.id, number: 0, guildCounted: 0
            });

            const embed = new MessageEmbed()
                .setTitle(`Counting info about ${message.guild.name}`)
                .addField("Numbers counted:", "0")
                .addField("Currect number:", "1")
                .setFooter({text: `${prefix}countingchannel to set the counting channel, and start counting!`})
                .setColor(randomColor);

            message.channel.send({ embeds: [embed] });
            return;


        // If the guild is found then send an embed with the actual information.
        } else {
            const embed = new MessageEmbed()
                .setTitle(`Counting info about ${message.guild.name}`)
                .addField("Numbers counted:", `${guildInDb.guildCounted}`)
                .addField("Currect number:", `${guildInDb.number}`)
                .setColor(randomColor);
            
            message.channel.send({ embeds: [embed] });
            return;
        }



        
    }
};