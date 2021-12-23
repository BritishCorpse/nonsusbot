module.exports = {
	name: "prefix",
	execute (client) {
    client.on("messageCreate", message => {
      if (message.content === "<@!" + client.user.id + ">") {
        message.channel.send("**My prefix here is** `" + client.serverConfig.get(message.guild.id).prefix + "`");
      }
    });
	}		
};
