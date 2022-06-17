const { guildCount, getCountingGuild } = require(`${__basedir}/db_objects.js`);

function chooseReactionEmoji(number) {
    if (number >= 9600) return "❤️";
    else if (number >= 4800) return "🧡";
    else if (number >= 2400) return "💛";
    else if (number >= 1200) return "💚";
    else if (number >= 600) return "💙";
    else if (number >= 300) return "💜";
    else if (number >= 200) return "🖤";
    else if (number >= 100) return "🤎";
    else if (number < 100) return "🤍";
}

module.exports = {
    async execute(graveyard, message) {
        if (message.author.bot) return;

        //* find the counting channel in the server_config.json file
        // return if its not found.
        // return if the current channel is not the counting channel.
        const countingChannel = (await graveyard.serverConfig.get(message.guild.id).counting_channel)[1] || null;
        if (message.channel.id !== countingChannel) return;
        
        //* find out if they want to remove non numbers in the channel
        // if its null it means that it either hasnt been set or they dont want us to remove them, in either case this works.
        let removeNaNs = await (graveyard.serverConfig.get(message.guild.id).remove_non_numbers_in_the_counting_channel)[1] || null;
        if (removeNaNs === null) removeNaNs = false;

        //* check if the message is a NaN (not a number)
        // if it is a nan and the guild is not allowing nans, try to delete it
        // if it is allowing nans, return
        if (isNaN(message.content) && removeNaNs === true) {
            return message.delete().catch(() => console.error);
        } else if (isNaN(message.content) && removeNaNs === false) {
            return;
        }

        const countedNumber = parseInt(message.content);

        //* find the guild in the countingSystem table  
        const guild = await getCountingGuild(message.guild.id);
        
        //* if the number is incorrect
        // add one to incorrectly counted
        // also add one incorrectly counted score to the user
        // set who counted last
        // reset the count back to 1    
        if (countedNumber !== guild.currentNumber || message.author.id === await guild.lastCounterUserID) {
            await guildCount.addIncorrectCount(message.guild.id, message.author.id);
            await guildCount.setLastCounterUserID(message.guild.id, message.author.id);
            await guildCount.resetGuildCount(message.guild.id);

            await message.react("💔");
            return message.channel.send(`${message.author} ruined the count! The number is now: \`1\``);
        } 
        
        //* if the number is correct
        // add one to correctly counted
        // also add one correctly counted score to the user
        // increase the number by 1
        // set who counted last
        else {
            await guildCount.addCorrectCount(message.guild.id, message.author.id);
            await guildCount.setLastCounterUserID(message.guild.id, message.author.id);
            await guildCount.addOneToGuildCount(message.guild.id);

            await message.react(chooseReactionEmoji(guild.currentNumber));
        }
    }
};