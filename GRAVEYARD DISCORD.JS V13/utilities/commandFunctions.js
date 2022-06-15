const fs = require("fs");

function getCommandCategories() {
    return fs.readdirSync(`${__basedir}/commands`);
}

async function missingPermissions(guildMember, interaction, command) {
    if (!guildMember.permissionsIn(interaction.channel).has((command.requiredBotPermissions || []))) {
        const missingPermissions = [];
        for (const permission of command.requiredBotPermissions) {
            if (!interaction.guild.me.permissionsIn(interaction.channel).has(permission)) {
                missingPermissions.push(permission);
            }
        }

        return missingPermissions;
    }

    return false;
}

module.exports = {
    getCommandCategories,
    missingPermissions
};