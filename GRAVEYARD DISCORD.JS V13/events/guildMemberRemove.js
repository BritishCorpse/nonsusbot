module.exports = {
    name: "guildMemberRemove",
    execute(graveyard) {
        //  
        //! delete database entries 
        //* delete database entries for the user that just left.
        //
        
        graveyard.on("guildMemberRemove", async guildMember => {
            //* delete database entries 
            // see file for more information
            const deleteUserDBEntries = await require(`${__basedir}/utilities/deleteUserDBEntries.js`);
            await deleteUserDBEntries.execute(graveyard, guildMember);
        });
    }
};