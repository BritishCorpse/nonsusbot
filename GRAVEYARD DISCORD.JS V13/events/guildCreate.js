module.exports = {
    name: "guildCreate",
    execute(graveyard) {
        //  
        //! Create database entries 
        //* creates database entries for the guild that we just joined
        // this is done so that there isn't a need to check if a guild exists in for example the counting system. since we already know the guild exists, we can just go ahead and get it.
        //
        
        graveyard.on("interactionCreate", async interaction => {
            if (!interaction.isCommand()) return;
            if (interaction.commandName !== "ping") return console.log("no.");

            const guild = interaction.guild;

            //* Create database entries 
            // see file for more information
            const createGuildDBEntries = await require(`${__basedir}/utilities/createGuildDBEntries.js`);
            await createGuildDBEntries.execute(graveyard, guild);
        });
    }
};