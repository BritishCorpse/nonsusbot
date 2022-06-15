module.exports = {
    name: "guildMemberRemove",
    execute(graveyard) {
        graveyard.on("guildMemberRemove", async guildMember => {
            //  
            //! delete database entries 
            //* delete database entries for the user that just left.
            //

            const deleteUserDBEntries = await require(`${__basedir}/utilities/deleteUserDBEntries.js`);
            await deleteUserDBEntries.execute(graveyard, guildMember);
        });
    }
};