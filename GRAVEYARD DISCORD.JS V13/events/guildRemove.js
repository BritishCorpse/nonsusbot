const { log } = require("../utilities/botLogFunctions");

module.exports = {
    name: "guildRemove",
    execute(graveyard) {
        graveyard.on("guildRemove", async guild => {
            //* log that we joined a guild
            await log(`Left guild: {NAME: {${guild.name}} ID: {${guild.id}}}`);
            
            //  
            //! Create database entries 
            //

            //* deletes database entries from the guild that we left
            const deleteGuildDBEntries = await require("/eventFiles/deleteGuildDBEntries.js");
            await deleteGuildDBEntries.execute(graveyard, guild);
        });
    }
};