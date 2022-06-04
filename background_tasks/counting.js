const developmentConfig = require(`${__basedir}/development_config.json`);

const { Counting, Users } = require(`${__basedir}/db_objects`);

const { warningLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "counting",
    execute(client) {
        client.on("messageCreate", async message => {
            //These are checks to make sure that messages are being handled in the guild.
            if (message.author.id === client.id) return;
            if (message.guild === null) return;
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return;

            // Declare what the counting channel is, if it does not exist, or if this is not the counting channel, return.
            let countingChannel;
            if (client.serverConfig.get(message.guild.id).counting_channel_id) {
                countingChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).counting_channel_id);
            }
            
            if (message.channel !== countingChannel || !countingChannel) return;

            // Check if the guild is allowing non number messages in the counting channel.
            let numberCheck;
            if (client.serverConfig.get(message.guild.id).numbers_in_counting) {
                numberCheck = await client.serverConfig.get(message.guild.id).numbers_in_counting;
            }

            //If the guild isnt allowing non numbers, try to delete the message.
            const newNumber = message.content;

            if (isNaN(newNumber)) {
                // if they donta allow non numbers
                if (numberCheck === "false" || numberCheck === false) {
                    try {
                        message.delete();
                    } catch (error) {
                        warningLog("Unable to delete non number message in a counting channel.", `${__dirname}/${__filename}.js`, "This is most likely a PEBCAK permission error. Therefore it is not solvable.", "GUILD-WARNING", "The guild has set the config numbers_in_counting to false, therefore I tried to delete the message.");
                    }

                // if they allow non numbers
                } else if (numberCheck === true) {
                    return;

                //if the config is set to neither
                } else {
                    warningLog(`Illegal config with the name: ${numberCheck}`, `${__dirname}/${__filename}.js`, "This is a very rare occurance, and overall shouldn't be possible. Requires manural review.", "CLIENT-ERROR");
                }
            } 

            // Find the guild in db, if it doesnt exist, create it and then find it again.
            let dbInfo = await Counting.findOne({
                where: { guildId: message.channel.guild.id }
            });
            if (!dbInfo) {
                warningLog("No database information found.", `${__dirname}/${__filename}.js`, "Very rare error, no need to solve. Most likely caused by just having joined a new guild.", "GUILD-WARNING");
                await Counting.create({guildId: message.channel.guild.id, number: 0, lastCounterId: 0});
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
                if (lastNumber + 1 < 100) {
                    message.react("👍");
                } else if (lastNumber + 1 >= 100 && lastNumber + 1 < 500) {
                    message.react(":ballot_box_with_check:");
                } else {
                    message.react("<:spirl:978361372586950666>");
                }
 
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

        client.on("messageDelete", async message => {
            //These are checks to make sure that messages are being handled in the guild.
            if (message.author.id === client.id) return;
            if (message.guild === null) return;
            if (message.author.bot && !testing) return;
            if (message.author.bot && testing && message.author.id !== developmentConfig.testing_bot_discord_user_id) return; 

            // Declare what the counting channel is, if it does not exist, or if this is not the counting channel, return.
            let countingChannel;
            if (client.serverConfig.get(message.guild.id).counting_channel_id) {
                countingChannel = await client.channels.fetch(client.serverConfig.get(message.guild.id).counting_channel_id);
            }
            
            if (message.channel !== countingChannel || !countingChannel) return;
        });

        //add something here that will check for when someone deletes a message that was already counted, so that they cant trick people into saying the wrong number.
    }
};