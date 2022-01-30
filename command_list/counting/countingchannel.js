const { saveServerConfig } = require(`${__basedir}/functions`);

module.exports = {
    name: "countingchannel",
    description: "Select the counting channel using this command.",
    usage: [],
    userPermissions: ["MANAGE_CHANNELS"],
    execute(message, args){
        // Set the counting_channel_id in the serverconfig to the channel that the message was sent in.
        const channel = args[0].replace(/[<>@#&!]/g, "");

        if (!args[0]) {
            message.channel.send("You did not specify a channel!");
            return;
        }

        if (isNaN(channel)) {
            message.channel.send("Channel is not actually a channel.");
            return;
        }

        message.client.serverConfig.get(message.guild.id).counting_channel_id = channel;
        saveServerConfig(message.client.serverConfig);

        const countingChannel = message.client.serverConfig.get(message.guild.id).counting_channel_id;

        countingChannel.send(`<@!${message.author.id}> the counting channel has been updated.\n\nThe counting starts at one.\nEach number is +1 from the one before it.`);
    }
};