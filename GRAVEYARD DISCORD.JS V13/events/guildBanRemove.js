const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { create } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "guildBanRemove",
    execute(graveyard) {
        graveyard.on("guildBanRemove", async guildBan => {
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

            await sendGuildLog(graveyard, "A user was unbanned", fields, create, null, "log_message_deletions", guildBan.guild);
        });
    }
};