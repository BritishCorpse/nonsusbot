const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { remove } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "guildBanAdd",
    execute(graveyard) {
        graveyard.on("guildBanAdd", async guildBan => {
            //
            //! Logging
            //

            //* send a log to the guild
            const fields = [
                {
                    name: "Banned user",
                    value: `${guildBan.user || "No user"}`
                },
                {
                    name: "Reason",
                    value: `${guildBan.reason}`
                }
            ];

            await sendGuildLog(graveyard, "A user was banned", fields, remove, null, "log_message_deletions", guildBan.guild);
        });
    }
};