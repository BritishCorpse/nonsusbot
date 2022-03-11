const developmentConfig = require(`${__basedir}/development_config.json`);

const { Counting, Users } = require(`${__basedir}/db_objects`);


module.exports = {
    name: "counting",
    execute(client) {
        client.on("messageCreate", async message => {
            // Declare what the counting channel is, if it does not exist, or if this is not the counting channel, return.
            let countingChannel;
            if (client.serverConfig.get(message.guild.id).counting_channel_id) {
                countingChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).counting_channel_id);
            }
            
            if (message.channel !== countingChannel || !countingChannel) return;


            // Disable bots, except the testing bot.
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;


            // Check if the message is a number.
            const newNumber = message.content;
            if (isNaN(newNumber)) return message.delete();


            // Find the guild in db, if it doesnt exist, create it and then find it again.
            let dbInfo = await Counting.findOne({
                where: { guildId: message.channel.guild.id }
            });
            if (!dbInfo) {
                await Counting.create({guildId: message.channel.guild.id, number: 0, lastCounterId: 0});
                console.log("hello");
            }
            dbInfo = await Counting.findOne({
                where: { guildId: message.channel.guild.id }
            });


            // Thel last number that was counted and stored in to the database.
            const lastNumber = dbInfo.number;


            // If by some means the number is null, make it zero.
            if (dbInfo.number === null) {
                dbInfo.number = 0;
                dbInfo.save();
            }


            // Make sure the same person cant count twice.
            if(dbInfo.lastCounterId === message.author.id) {
                message.channel.send(`${message.author} ruined counting at ${lastNumber + 1}!\nCounting starts at 1.`);
                dbInfo.number = 0;
                dbInfo.lastCounterId = 0;
                dbInfo.save(); 

                return;
            }

            // If number is correct.
            if (parseInt(newNumber) === lastNumber + 1) {
                message.react("👍");
                dbInfo.number += 1;
                dbInfo.guildCounted += 1;
                dbInfo.save();

            // If number is anything except the correct number.
            } else {
                message.channel.send(`${message.author} ruined counting at ${lastNumber + 1}!\nCounting starts at 1.`);
                dbInfo.number = 0;
                dbInfo.lastCounterId = 0;
                dbInfo.save(); 

                return;
            }

            // Write down the person who got the number and store it in the database.
            dbInfo.lastCounterId = message.author.id;
            dbInfo.save();

            // Add +1 amountCounted and amountCorrect to the user who got it correct.
            const userInDb = await Users.findOne({
                where: { user_id: message.author.id }
            });
            
            if (!userInDb) return;

            if (!userInDb.amountCounted) {
                userInDb.amountCounted = 1;
                userInDb.countedCorrect = 1;
                userInDb.save();
                return;
            }

            userInDb.amountCounted ++;
            userInDb.countedCorrect ++;
            userInDb.save();
        });
    }
};