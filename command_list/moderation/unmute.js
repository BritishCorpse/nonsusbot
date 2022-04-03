module.exports = {
    name: "unmute",
    description: "Unmutes a muted member.",
    botPermissions: ["MANAGE_ROLES"],
    userPermissions: ["MUTE_MEMBERS"],
    
    usage: [],
    async execute(message) {
        //Find the mentioned user.
        const punishedUser = message.mentions.members.first();

        if(!punishedUser || punishedUser.user.id === message.author.id || punishedUser.user.id === message.client.id) {
            message.channel.send("Please mention a valid user.");
            return;
        }

        //Find the mute_role_id config.
        let muteRole;

        if (message.client.serverConfig.get(message.guild.id).mute_role_id) {
            muteRole = await message.guild.roles.fetch(message.client.serverConfig.get(message.guild.id).mute_role_id);
        }

        //If there is no muterole, it's not possible for a user to be muted. So we just tell the user the target is not muted.
        if (muteRole === undefined) return message.channel.send("The user is not muted.");

        //If the muterole was found, check if the target has it.
        if (!punishedUser.roles.cache.some(role => role.id === muteRole.id)) {
            message.channel.send("The user is not muted.");
            return;
        }

        //If all checks pass, try to unmute the member.
        punishedUser.roles.remove(muteRole).catch(error => {
            console.log(error);
        });

        //Let the user know that the target was unmuted.
        message.channel.send(`${punishedUser} was unmuted.`);
    }
};