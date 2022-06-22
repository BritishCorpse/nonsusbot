const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { remove } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "userMessageUpdate",
    execute(graveyard) {
        graveyard.on("messageUpdate", async (oldMessage, newMessage) => {
            //! THIS FILE ONLY HANDLES MESSAGES CREATED BY USERS.
            if (oldMessage.author.bot) return;

            //
            //! Logging
            //

            //* send a log to the guild
            // define the fields used for the log
            const fields = [
                {
                    name: "Old content",
                    value: `${oldMessage.content || "No content"}`
                },
                {
                    name: "New content",
                    value: `${newMessage.content}`
                },
                {
                    name: "Message author",
                    value: `${oldMessage.author}`
                }
            ];

            // send the log
            await sendGuildLog(graveyard, "A message was updated", fields, remove, null, "log_message_updates", newMessage.guild);
        });
    }
};