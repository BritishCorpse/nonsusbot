const developmentConfig = require(`${__basedir}/development_config.json`);
const { MessageEmbed } = require("discord.js");

const { SuggestionMessages} = require(`${__basedir}/db_objects.js`); 

module.exports = {
    name: "suggestion", 
    execute(client) {
        client.on("messageCreate", async message => {
            //These are checks to make sure that messages are being handled in the guild.
            if (message.author.id === client.id) return;
            if (message.guild === null) return;
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            const randomColor = Math.floor(Math.random() * 16777215).toString(16);

            let suggestionChannel;
            let sendSuggestionChannel;
            if (client.serverConfig.get(message.guild.id).suggestion_channel_id) {
                suggestionChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).suggestion_channel_id);
            }
            if (client.serverConfig.get(message.guild.id).send_suggestion_channel_id) {
                sendSuggestionChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).send_suggestion_channel_id);
            }

            // Check if both the suggestion channels exist.
            if (!suggestionChannel || !sendSuggestionChannel) return;

            // Prevent embeds or integrated messages being sent.
            if (!message.content) {return;}
            
            // Check if the message is from sendSuggestionChannel
            if (message.channel.id !== sendSuggestionChannel.id) return;

            // Delete message in the sendSuggestionChannel
            try {
                message.delete();
            } catch (error) {
                console.log("-----GUILD-ERROR(FAILED TO DELETE MESSAGE)-----");
                console.log("This happened in the suggestion.js file. Most likely a missing permissions error.");
                console.log(`-----ERROR-AT-----\n${new Date.now()}`);
                console.trace(error);
                console.error();
                console.log("\n\n");

                return;
            }


            const embed = new MessageEmbed()
                .setAuthor({name: `${message.author.tag}`, iconURL: message.author.avatarURL()})
                .addField("Suggestion:", `${message.content}`)
                .setColor(randomColor);

            suggestionChannel.send({ embeds: [embed] }) .then(async suggestionMessage => {
                suggestionMessage.react("🟩");
                suggestionMessage.react("🟥");

                await SuggestionMessages.create({message_id: suggestionMessage.id, user_id: message.author.id, sent_at: Date.now()});
            });

        });

    }
};
