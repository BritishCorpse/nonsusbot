const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "suggestion", 
    execute(client) {
        client.on("message", message => {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);

            const suggestionChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).suggestion_channel_id);
            const sendSuggestionChannel = client.channels.cache.get(client.serverConfig.get(message.guild.id).send_suggestion_channel_id);

            // Check if both the suggestion channels exist.
            if (!suggestionChannel || !sendSuggestionChannel) {return;}

            // Prevent embeds or integrated messages being sent.
            if (!message.content) {return;}
            
            // Check if the message is from sendSuggestionChannel
            if (message.channel.id !== sendSuggestionChannel.id) {return;}

            // Delete message in the sendSuggestionChannel
            message.delete();

            const embed = new MessageEmbed()
                .setAuthor({name: `${message.author.tag}`, iconURL: message.author.avatarURL()})
                .addField("Suggestion:", `${message.content}`)
                .setColor(randomColor);

            suggestionChannel.send({ embeds: [embed] }) .then(suggestionMessage => {
                suggestionMessage.react("🟩");
                suggestionMessage.react("🟥");
            });

        });

    }
};