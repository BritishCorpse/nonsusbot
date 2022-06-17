const { makeEmbed } = require(`${__basedir}/utilities/generalFunctions.js`);  

const { info } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "guildMemberRemove",
    execute(graveyard) {
        graveyard.on("guildMemberRemove", async guildMember => {
            //  
            //! delete database entries 
            //* delete database entries for the user that just left.
            //

            const deleteUserDBEntries = await require("./eventFiles/deleteUserDBEntries.js");
            await deleteUserDBEntries.execute(graveyard, guildMember);

            //
            //! Goodbye message
            //

            //* find the goodbye channel and message in the serverConfig file
            const goodbyeChannelInConfig = await graveyard.serverConfig.get(guildMember.guild.id).goodbye_channel[1];
            const goodbyeChannel = await graveyard.channels.cache.get(goodbyeChannelInConfig);

            const goodbyeMessage = await graveyard.serverConfig.get(guildMember.guild.id).goodbye_message[1];
            const goodbyeImageURL = await graveyard.serverConfig.get(guildMember.guild.id).goodbye_image[1];

            //* if theyre both set, send the goodbye message in the appropriate channel
            if (goodbyeChannel !== null && goodbyeMessage !== null) {
                await goodbyeChannel.send({ content: `${guildMember}`, embeds: [await makeEmbed(graveyard, goodbyeMessage, null, info, goodbyeImageURL)]});
            }
        });
    }
};