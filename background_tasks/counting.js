const { Counting, Users } = require(`${__basedir}/db_objects`);

async function chooseReactionEmoji(number) {
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
    name: "counting",
    execute(client) {
        client.on("messageCreate", async message => {
            if (!message.guild) return; //disables counting in dms.
            if (message.author.bot) return;

            const countedNumber = parseInt(message.content);

            const userInCounting = await Users.findOne({ where: { user_id: message.author.id } });
            if (!userInCounting) return await Users.create({ where: { user_id: message.author.id } });

            const countingChannel = await client.serverConfig.get(message.guild.id).counting_channel_id || null;
            if (countingChannel === null || message.channel.id !== countingChannel) return; //returns if the config does not exist or if this is not the channel.

            const guildInCounting = await Counting.findOne({ where: { guildId: message.guild.id } }) || null;
            if (guildInCounting === null) return; // returns if the guild doesnt exist in the database.

            let allowNaNs = await client.serverConfig.get(message.guild.id).numbers_in_counting;
            if (allowNaNs === null) allowNaNs = true; // allow regular messages if they havent said otherwise.

            if (allowNaNs === false && isNaN(countedNumber)) return await message.delete(); // delete message if theyre not allowing regular messages.
            if (isNaN(countedNumber)) return; // returns if the message is not a number.

            // passes if they said the incorrect number.
            if(countedNumber !== guildInCounting.number || message.author.id === guildInCounting.lastCounterId) {
                guildInCounting.number = 1;
                guildInCounting.lastCounterId = 0;

                guildInCounting.save();

                userInCounting.amountCounted += 1;
                
                userInCounting.save();
                return message.channel.send(`${message.author} ruined the count! The next number is: \`1\``);
            }

            message.react(await chooseReactionEmoji(countedNumber)); // add a cool emoji to let the user know what happened

            guildInCounting.number += 1;
            guildInCounting.lastCounterId = message.author.id;

            userInCounting.countedCorrect += 1;
            userInCounting.amountCounted += 1;

            userInCounting.save();
            guildInCounting.save();
        });

        client.on("messageDelete", async message => {
            if (!message.guild) return; //disables counting in dms.
            if (message.author.bot) return;

            const countingChannel = await client.serverConfig.get(message.guild.id).counting_channel_id || null;
            if (countingChannel === null || message.channel.id !== countingChannel) return; //returns if the config does not exist or if this is not the channel.

            const guildInCounting = await Counting.findOne({ where: { guildId: message.guild.id } }) || null;
            if (guildInCounting === null) return; // returns if the guild doesnt exist in the database.

            if (isNaN(message.content)) return; // returns if the message is not a number.            

            const botMessage = await message.channel.send(`${message.author} deleted their count! They said the number: \`${message.content}\``);

            return botMessage.react(await chooseReactionEmoji(message.content));
        });

        //add something here that will check for when someone deletes a message that was already counted, so that they cant trick people into saying the wrong number.
    }
};