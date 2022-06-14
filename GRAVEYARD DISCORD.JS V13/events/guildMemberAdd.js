module.exports = {
    name: "guildMemberAdd",
    execute(graveyard) {
        //  
        //! Create database entries 
        //* creates database entries for the user that just joined.
        //
        
        graveyard.on("interactionCreate", async interaction => {
            if (!interaction.isCommand()) return;
            if (interaction.commandName !== "ping") return console.log("no.");

            const user = interaction.user;

            //* Create database entries 
            // see file for more information
            const createUserDBEntries = await require(`${__basedir}/utilities/createUserDBEntries.js`);
            await createUserDBEntries.execute(graveyard, user);
        });
    }
};