module.exports = {
    name: "countingSystem",
    async execute(graveyard) {
        graveyard.on("messageCreate", async message => {
            //* find the counting channel in the server_config.json file
            // return if its not found.
            // return if the current channel is not the counting channel.
            const countingChannel = await graveyard.serverConfig.get(message.guild.id).counting_channel[1] || null;

            if (countingChannel === null) return console.log("The channel is not defined.");
            if (message.channel.id !== countingChannel) return console.log("This is not the counting channel.");
            
            //* find out if they want to remove non numbers in the channel
            // if its null it means that it either hasnt been set or they dont want us to remove them, in either case this works.
            let removeNaNs = await graveyard.serverConfig.get(message.guild.id).remove_non_numbers_in_the_counting_channel[1] || null;
            if (removeNaNs === null) removeNaNs = false;

            
        });
    }
};