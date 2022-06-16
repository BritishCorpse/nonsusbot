const { addNewGuildServerConfigs } = require("../utilities/configFunctions");

const { info } = require("../configs/colors.json");

const { makeEmbed } = require("../utilities/generalFunctions");

const { log } = require("../utilities/botLogFunctions");

module.exports = {
    name: "guildCreate",
    execute(graveyard) {
        graveyard.on("guildCreate", async guild => {
            //* log that we joined a guild
            await log("I joined a guild");
            
            //  
            //! Create database entries 
            //

            //* creates database entries for the guild that we just joined
            // this is done so that there isn't a need to check if a guild exists in for example the counting system. since we already know the guild exists, we can just go ahead and get it.
            const createGuildDBEntries = await require(`${__basedir}/utilities/createGuildDBEntries.js`);
            await createGuildDBEntries.execute(graveyard, guild);

            //
            //! Add new guild server configs
            //

            //* loops through every guild in the cache of the bot, then makes a config template for it
            await addNewGuildServerConfigs(graveyard);

            //
            //! Try to send a thank you for adding me message
            //
            
            const fields = [
                {
                    name: "Set up configuration!",
                    value:  "Set up configuration for your Discord server either with /setconfig or with our dashboard!"
                }, 
                {
                    name: "Make sure I've got the permissions I need!",
                    value: "If you want me to be able to moderate members, delete messages and so forth, make sure to give me permissions to do so!"
                },
                {
                    name: "Check out our website and Discord server for more information.",
                    value: "PUT WEBSITE LINK HERE, PUT DISCORD INVITE HERE"
                }
            ];

            const channels = await guild.channels.cache.filter(channel => channel.type == "GUILD_TEXT");
            channels.first().send({ embeds: [await makeEmbed(graveyard, "Thank you for adding me!", fields, info)] });
        });
    }
};