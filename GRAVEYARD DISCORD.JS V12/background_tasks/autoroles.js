//const { MessageEmbed } = require("discord.js");
const { AutoRoleRoles } = require(`${__basedir}/db_objects`);
const { infoLog, errorLog } = require(`${__basedir}/utilities`);

module.exports = {
    name: "autoroles",
    async execute(client) {
        // NOTE: this requires the MESSAGE and REACTION partials to be enabled (in the client initialization)
        async function getRolesFromDatabase(guildId) {
            const roles = await AutoRoleRoles.findAll({
                where: {
                    guild_id: guildId,
                }
            });

            return roles;
        }

        if (getRolesFromDatabase === null) return;

        client.on("guildMemberAdd", async (guildMember) => {
            if (guildMember.user.id === client.user.id) return; // don't give itself roles

            const rolesToGive = await getRolesFromDatabase(guildMember.guild.id);
            
            // if it is not a reaction for a role, return (it is on a self role message, but a different reaction)
            if (rolesToGive === null || rolesToGive.length === 0) return;


            try {
                guildMember.roles.add(rolesToGive.map(role => role.role_id), "Automatically given to the user for joining the server.");
            } catch (error) {
                errorLog([1,2,8,9], `${__basedir}/${__filename}`, "2", "Most likely not solvable, sounds like a PEBCAK.", "GUILD-ERROR");
                return;
            }

            infoLog("Added a role to a user using the auto roles system.", `${__basedir}/${__filename}`, "GUILD-INFO");
        });
    }
};
