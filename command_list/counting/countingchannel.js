const { saveServerConfig } = require(`${__basedir}/functions`);

module.exports = {
    name: "countingchannel",
    description: "Select the counting channel using this command.",
    usage: [],
    userPermissions: ["MANAGE_CHANNELS"],
    execute(message){
        // Set the counting_channel_id in the serverconfig to the channel that the message was sent in.
        message.client.serverConfig.get(message.guild.id).counting_channel_id = message.channel.id;
        saveServerConfig(message.client.serverConfig);

        message.channel.send(`<@!${message.author.id}> the counting channel has been updated.\nThe counting starts at one. Each user can only type 1 number at a time.\nEach number must be n+1 where n is the previously typed number.`);
    }
};