const fs = require("fs");
const { MessageEmbed } = new require("discord.js");

module.exports = {
  name: 'help',
  description: "Help page for commands.",
  execute (message, args) {
    const prefix = message.client.serverConfig.get(message.guild.id).prefix;
    const commandFiles = fs.readdirSync('./command_list').filter(file => file.endsWith('.js'));
    
    let embed = new MessageEmbed()
      .setColor("RED");
    if (args[0] === undefined || args[0] === "") {
      let responseMessage = "";
    
      for (const file of commandFiles) {
        const command = require(`./${file}`);
        responseMessage += command.name + ": ";
        responseMessage += command.description + "\n";
      }

      embed.setTitle("Help")
        .setDescription(responseMessage)
        .setFooter("Do " + prefix + "help <command> for more information");
    } else {
      let commandName = args[0];
      if (commandName.startsWith(prefix)) {
        commandName = commandName.slice(1, commandName.length);
      }

      //let commandFile;

      let command;
      let exists = false;
      for (const file of commandFiles) {
        command = require(`./${file}`);
        if ((typeof command.name === "string" && command.name === commandName)
            || (typeof command.name === "object" && command.name.includes(commandName))) {
          exists = true;
          break;
        }
      }
      
      if (!exists) {
        message.channel.send("The command " + commandName + " was not found.");
        return;
      }

      embed.setTitle(command.name)
        .setDescription(command.description);
    }

    message.channel.send(embed);
  }
}
