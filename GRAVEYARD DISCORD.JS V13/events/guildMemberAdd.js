module.exports = {
    name: "guildMemberAdd",
    execute(graveyard) {
        graveyard.on("guildMemberAdd", async guildMember => {
            //  
            //! Database entries
            //

            //* creates database entries for the user that just joined.
            const createUserDBEntries = await require("./eventFiles/createUserDBEntries.js");
            await createUserDBEntries.execute(graveyard, guildMember);

            //
            //! Welcome message
            //

            //* find the welcome channel and message in the serverConfig file
            const welcomeChannelInConfig = await graveyard.serverConfig.get(guildMember.guild.id).welcome_channel[1];
            const welcomeChannel = await graveyard.channels.cache.get(welcomeChannelInConfig);

            const welcomeMessage = await graveyard.serverConfig.get(guildMember.guild.id).welcome_message[1];

            //* if theyre both set, send the welcome message
            if (welcomeMessage !== null && welcomeChannel !== null) {
                await welcomeChannel.send(`${guildMember}: ${welcomeMessage}`);
            }
        });
    }
};