const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { remove } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "userMessageDelete",
    execute(graveyard) {
        graveyard.on("messageDelete", async message => {
            //! THIS FILE ONLY HANDLES MESSAGES CREATED BY USERS.
            if (message.author.bot) return;

            //
            //! Logging
            //

            //* send a log to the guild
            const fields = [
                {
                    name: "Message content",
                    value: `${message.content || "No content"}`
                },
                {
                    name: "Message author",
                    value: `${message.author}`
                }
            ];

            await sendGuildLog(graveyard, "A message was deleted", fields, remove, null, "log_message_deletions", message.guild);
        });
    }
};