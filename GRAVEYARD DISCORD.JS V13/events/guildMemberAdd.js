module.exports = {
    name: "guildMemberAdd",
    execute(graveyard) {
        graveyard.on("guildMemberAdd", async guildMember => {
            //  
            //! Create database entries 
            //* creates database entries for the user that just joined.
            //

            const createUserDBEntries = await require(`${__basedir}/utilities/createUserDBEntries.js`);
            await createUserDBEntries.execute(graveyard, guildMember);
        });
    }
};