const { SelfRoleMessages, VerifyMessages } = require(`${__basedir}/db_objects`);
const { infoLog, errorLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "autodbdeletion",
    async execute(client) {
        client.on("messageDelete", async (message) => {
            const messageId = message.id;

            // check if the message that was deleted is in the database.
            const selfRoleMessage = SelfRoleMessages.findOne({
                where: {
                    message_id: messageId
                }
            }) || null;

            // check if the message that was deleted is in the verifymessages database.
            const verifyMessage = VerifyMessages.findOne({
                where: {
                    // don't ask why its just called message. it refers to the message's id though.
                    message: messageId
                }
            }) || null;

            //if it exists, delete it from the db.
            if (selfRoleMessage !== null) {
                try {
                    SelfRoleMessages.destroy({
                        where: {
                            message_id: messageId
                        }
                    }); 
    
                    infoLog("Deleted an entry from the database.", `${__basedir}/${__filename}`, "GUILD-INFO", "Deleted a message id.");
                    return;
                } catch (error) {
                    errorLog([4, 5, 1], `${__basedir}/${__filename}`, 2, "Check that the id exists in the database, and that the table/database exists.", "CLIENT-ERROR");
                    return;
                }

            }

            if (verifyMessage !== null) {
                try {
                    VerifyMessages.destroy({
                        where: {
                            message: messageId
                        }
                    });

                    infoLog("Deleted an entry from the database.", `${__basedir}/${__filename}`, "GUILD-INFO", "Deleted a message id.");
                    return;
                } catch (error) {
                    errorLog([4, 5, 1], `${__basedir}/${__filename}`, 2, "Check that the id exists in the database, and that the table/database exists.", "CLIENT-ERROR");
                    return;
                }
            }
        });
    }
};