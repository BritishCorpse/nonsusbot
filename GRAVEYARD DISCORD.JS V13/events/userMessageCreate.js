const { userCurrency } = require(`${__basedir}/db_objects`); 

module.exports = {
    name: "userMessageCreate",
    execute(graveyard) {
        graveyard.on("messageCreate", async message => {
            //! THIS FILE ONLY HANDLES MESSAGES CREATED BY USERS.
            if (message.author.bot) return;

            //
            //! Currency
            //

            //* add one coin to the users balance
            await userCurrency.addBalance(message.author.id, 1);

            //
            //! Counting
            //

            //* find the counting channel in the serverconfig
            const countingChannel = await graveyard.serverConfig.get(message.guild.id).counting_channel;

            //* if we are in the counting channel, run the countingSystem.js script
            if (countingChannel !== null && message.channel.id === countingChannel[1]) {
                const deleteUserDBEntries = await require("./eventFiles/countingSystem.js");
                await deleteUserDBEntries.execute(graveyard, message);
            }
        });
    }
};