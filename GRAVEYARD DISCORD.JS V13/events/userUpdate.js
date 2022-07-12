const { sendGuildLog } = require(`${__basedir}/utilities/generalFunctions.js`);

const { remove } = require(`${__basedir}/configs/colors.json`);

module.exports = {
    name: "userUpdate",
    execute(graveyard) {
        graveyard.on("userUpdate", async (oldUser, newUser) => {
            //* if the user somehow doesn't exist, return
            if (!oldUser) return;

            //
            //! Logging
            //
            
            //* send a log to the guil
            // make an empty array where we will store all the embed fields
            const fields = [
            ];

            // this is used for if a user changed their profile picture.
            let image = null;

            // find out what changed, since discord wont tell us
            if (newUser.tag !== oldUser.tag) {
                fields.push({
                    name: "New tag",
                    value: `${newUser.tag}`
                });
            }

            // if their profile picture changed
            if (newUser.avatarURL() !== oldUser.avatarURL()) {
                image = newUser.avatarURL({ size: 1024 });
            }

            if (newUser.hexAccentColor !== oldUser.hexAccentColor) {
                fields.push({
                    name: "New hex accent color",
                    value: `${newUser.hexAccentColor}`
                });
            }
 
            // send the log
            await sendGuildLog(graveyard, "A user was updated", fields, remove, image, "log_user_updates", newUser.guild);
        });
    }
};