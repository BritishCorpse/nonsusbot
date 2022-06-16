module.exports = {
    name: "guildMemberRemove",
    execute(graveyard) {
        graveyard.on("guildMemberRemove", async guildMember => {
            //  
            //! delete database entries 
            //* delete database entries for the user that just left.
            //

            const deleteUserDBEntries = await require("/eventFiles/deleteUserDBEntries.js");
            await deleteUserDBEntries.execute(graveyard, guildMember);

            //
            //! Goodbye message
            //

            //* find the goodbye channel and message in the serverConfig file
            const goodbyeChannelInConfig = await graveyard.serverConfig.get(guildMember.guild.id).welcome_channel[1];
            const goodbyeChannel = await graveyard.channels.cache.get(goodbyeChannelInConfig);

            const goodbyeMessage = await graveyard.serverConfig.get(guildMember.guild.id).welcome_message[1];

            //* if theyre both set, send the welcome message
            if (goodbyeChannel !== null && goodbyeMessage !== null) {
                await goodbyeChannel.send(`${guildMember}: ${goodbyeMessage}`);
            }
        });
    }
};