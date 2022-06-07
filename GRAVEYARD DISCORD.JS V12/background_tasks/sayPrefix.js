module.exports = {
    name: "say_prefix",
    execute (client) {
        client.on("messageCreate", message => {

            if (message.channel === null) return; // ignore dms

            if (message.mentions.has(client.user.id, {ignoreRoles: true, ignoreEveryone: true})) {
                message.channel.send("**My prefix here is** `" + client.serverConfig.get(message.guild.id).prefix + "`");
            }
        });
    }		
};
